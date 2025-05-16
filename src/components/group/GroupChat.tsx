import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Types

type Message = Database['public']['Tables']['messagerie']['Row'];

type User = {
  id: string;
  nom: string | null;
  email: string;
};

const ALLOWED_ROLES = ['admin', 'employe', 'fournisseur'];

const GroupChat: React.FC = () => {
  const { user, userRoles, isLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Vérifie si l'utilisateur a un rôle autorisé
  const isAllowed = userRoles.some((role) => ALLOWED_ROLES.includes(role));

  // Récupère les messages de groupe (destinataire_id null)
  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messagerie')
      .select('*')
      .eq('destinataire_id', null)
      .order('date_envoi', { ascending: true });
    if (!error && data) {
      setMessages(data);
      // Récupère les infos utilisateurs pour affichage
      const userIds = Array.from(new Set(data.map((m) => m.expediteur_id).filter(Boolean)));
      if (userIds.length > 0) {
        const { data: userData } = await supabase
          .from('utilisateur')
          .select('id, nom, email')
          .in('id', userIds);
        if (userData) {
          const userMap: Record<string, User> = {};
          userData.forEach((u) => { userMap[u.id] = u; });
          setUsers(userMap);
        }
      }
    }
    setLoading(false);
  };

  // Envoie un message de groupe
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    const { error } = await supabase.from('messagerie').insert([
      {
        message: newMessage,
        expediteur_id: user.id,
        destinataire_id: null,
        date_envoi: new Date().toISOString(),
      }
    ]);
    if (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      if (typeof window !== 'undefined') {
        alert("Erreur lors de l'envoi du message: " + error.message);
      }
    } else {
      setNewMessage('');
      fetchMessages();
    }
  };

  // Scroll auto en bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isAllowed) fetchMessages();
    // Optionnel: abonnement temps réel
    const channel = supabase
      .channel('group-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messagerie', filter: 'destinataire_id=is.null' },
        (payload) => {
          fetchMessages();
        }
      )
      .subscribe();
    return () => { channel.unsubscribe(); };
    // eslint-disable-next-line
  }, [isAllowed]);

  if (isLoading) return <div>Chargement...</div>;
  if (!isAllowed) return <div>Accès réservé aux fournisseurs, employés et admins.</div>;

  return (
    <div className="max-w-lg mx-auto bg-white rounded shadow p-4 flex flex-col h-[70vh]">
      <h2 className="text-xl font-bold mb-2 text-green-700">Messagerie d'équipe</h2>
      <div className="flex-1 overflow-y-auto mb-2 bg-gray-50 p-2 rounded">
        {loading ? (
          <div>Chargement des messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-gray-400">Aucun message pour le moment.</div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`mb-2 ${msg.expediteur_id === user?.id ? 'text-right' : 'text-left'}`}>
              <div className="inline-block bg-green-100 px-3 py-1 rounded">
                <span className="font-semibold text-green-800">
                  {users[msg.expediteur_id || '']?.nom || users[msg.expediteur_id || '']?.email || 'Utilisateur'}
                </span>
                <span className="ml-2 text-gray-600 text-xs">
                  {msg.date_envoi ? new Date(msg.date_envoi).toLocaleString() : ''}
                </span>
                <div className="text-gray-800">{msg.message}</div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2 mt-2">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1 focus:outline-green-500"
          placeholder="Votre message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          disabled={loading || !newMessage.trim()}
        >
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default GroupChat;
