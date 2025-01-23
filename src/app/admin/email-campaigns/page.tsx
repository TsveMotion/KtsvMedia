'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface EmailGroup {
  id: string;
  name: string;
  emailCount: number;
  createdAt: string;
}

interface Campaign {
  id: string;
  subject: string;
  content: string;
  groupId: string;
  status: string;
  sentAt: string | null;
  createdAt: string;
}

export default function EmailCampaigns() {
  const [groups, setGroups] = useState<EmailGroup[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchGroups();
    fetchCampaigns();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/admin/email-groups');
      if (!response.ok) throw new Error('Failed to fetch groups');
      const data = await response.json();
      setGroups(data.groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/admin/email-campaigns');
      if (!response.ok) throw new Error('Failed to fetch campaigns');
      const data = await response.json();
      setCampaigns(data.campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async () => {
    if (!selectedGroup || !subject || !content) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/admin/email-campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupId: selectedGroup,
          subject,
          content,
        }),
      });

      if (!response.ok) throw new Error('Failed to create campaign');

      // Reset form and refresh campaigns
      setSelectedGroup('');
      setSubject('');
      setContent('');
      fetchCampaigns();

      alert('Campaign created successfully!');
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign');
    }
  };

  const sendCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to send this campaign?')) return;

    try {
      const response = await fetch(`/api/admin/email-campaigns/${campaignId}/send`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to send campaign');

      fetchCampaigns();
      alert('Campaign sent successfully!');
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert('Failed to send campaign');
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-8">Admin Dashboard</h1>
          <nav className="space-y-2">
            <Link 
              href="/admin"
              className="block py-2 px-4 rounded text-white hover:bg-gray-700"
            >
              Bookings
            </Link>
            <Link 
              href="/admin/emails"
              className="block py-2 px-4 rounded text-white hover:bg-gray-700"
            >
              Email Manager
            </Link>
            <Link 
              href="/admin/email-campaigns"
              className="block py-2 px-4 rounded bg-gray-700 text-white hover:bg-gray-600"
            >
              Email Campaigns
            </Link>
            <Link 
              href="/"
              className="block py-2 px-4 rounded text-white hover:bg-gray-700"
            >
              Back to Website
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md border p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Create Campaign</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Select Email Group
                </label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full p-2 border rounded text-black"
                  required
                >
                  <option value="">Select a group...</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name} ({group.emailCount} emails)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2 border rounded text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Email Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-48 p-2 border rounded text-black"
                  required
                />
              </div>

              <button
                onClick={createCampaign}
                disabled={!selectedGroup || !subject || !content}
                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-300"
              >
                Create Campaign
              </button>
            </div>
          </div>

          {/* Campaign History */}
          <div className="bg-white rounded-lg shadow-md border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Campaign History</h2>
            </div>

            {loading ? (
              <p>Loading campaigns...</p>
            ) : campaigns.length === 0 ? (
              <p>No campaigns found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-black">Date</th>
                      <th className="px-4 py-2 text-left text-black">Subject</th>
                      <th className="px-4 py-2 text-left text-black">Group</th>
                      <th className="px-4 py-2 text-left text-black">Status</th>
                      <th className="px-4 py-2 text-left text-black">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 text-black">
                          {new Date(campaign.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-2 text-black">{campaign.subject}</td>
                        <td className="px-4 py-2 text-black">{groups.find(g => g.id === campaign.groupId)?.name}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 rounded text-sm ${
                            campaign.status === 'sent'
                              ? 'bg-green-100 text-green-800'
                              : campaign.status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {campaign.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {campaign.status !== 'sent' && (
                            <button
                              onClick={() => sendCampaign(campaign.id)}
                              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            >
                              Send Now
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
