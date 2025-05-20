import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Types

type MessageWithUser = {
  id: number;
  message: string;
  date_envoi: string;
  expediteur_id: string;
  destinataire_id?: string | null;
  utilisateur?: { nom: string | null; email: string } | null;
};

type User = {
  id: string;
  nom: string | null;
  email: string;
};

const ALLOWED_ROLES = ['admin', 'employe', 'fournisseur'];

export default function GroupChat() {
  const { user, userRoles } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const isAllowed = user && userRoles.some((role) => ALLOWED_ROLES.includes(role));

  // Récupérer les messages
  async function fetchMessages() {
    setFetchError(null);
    const { data, error } = await supabase
      .from("messagerie")
      .select("id, message, date_envoi, expediteur_id, utilisateur:expediteur_id (nom, email)")
      .is("destinataire_id", null)
      .order("date_envoi", { ascending: true });
    if (error) {
      setFetchError(error.message);
      setMessages([]);
    } else {
      setMessages(data || []);
      console.log("Messages récupérés :", data);
    }
  }

  // Envoi d'un message
  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    // Vérifie si l'utilisateur existe dans la table utilisateur et l'ajoute si nécessaire
    const { error: upsertUserError } = await supabase
      .from('utilisateur')
      .upsert([{
        id: user.id,
        email: user.email,
        nom: user.user_metadata?.nom || '',
        mot_de_passe: '',
        role: user.user_metadata?.role || null,
        user_id: user.id
      }], {
        onConflict: 'email'
      });

    if (upsertUserError) {
      alert("Erreur lors de la vérification/création de l'utilisateur : " + upsertUserError.message);
      console.error(upsertUserError);
      return;
    }

    // Insère le message
    const { error } = await supabase.from("messagerie").insert([
      {
        message: newMessage,
        expediteur_id: user.id,
        destinataire_id: null,
        date_envoi: new Date().toISOString(),
      },
    ]);
    if (error) {
      alert('Erreur lors de l\'envoi du message : ' + error.message);
      console.error('Erreur détaillée Supabase:', error);
      return;
    }
    setNewMessage("");
    fetchMessages();
  }

  // Scroll auto
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialisation et temps réel
  useEffect(() => {
    if (isAllowed) fetchMessages();
    // Realtime : écoute tous les changements sur la table messagerie (messages de groupe)
    const channel = supabase
      .channel('messagerie-group-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messagerie', filter: 'destinataire_id=is.null' },
        () => fetchMessages()
      )
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, [isAllowed]);

  if (!isAllowed) return <div>Accès réservé aux fournisseurs, employés et admins.</div>;

  return (
    <div className="max-w-lg mx-auto bg-white rounded shadow p-4 flex flex-col h-[70vh]">
      <h2 className="text-xl font-bold mb-2 text-green-700">Messagerie d'équipe</h2>
      <div className="flex-1 overflow-y-auto mb-2 bg-gray-50 p-2 rounded">
        {fetchError && (
          <div className="text-red-500">Erreur de chargement : {fetchError}</div>
        )}
        {messages.length === 0 && !fetchError && (
          <div className="text-gray-400">Aucun message pour le moment.</div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-2 ${msg.expediteur_id === user?.id ? "text-right" : "text-left"}`}>
            <div className="inline-block bg-green-100 px-3 py-1 rounded">
              <span className="font-semibold text-green-800">
                {msg.utilisateur?.nom || msg.utilisateur?.email || "Utilisateur"}
              </span>
              <span className="ml-2 text-gray-600 text-xs">
                {msg.date_envoi ? new Date(msg.date_envoi).toLocaleString() : ""}
              </span>
              <div className="text-gray-800">{msg.message}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2 mt-2">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1 focus:outline-green-500"
          placeholder="Votre message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          disabled={!newMessage.trim()}
        >
          Envoyer
        </button>
      </form>
    </div>
  );
}
