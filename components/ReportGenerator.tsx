
import React, { useState, useEffect } from 'react';
import { ReportData, Recipient } from '../types';
import { MailIcon } from './icons/MailIcon';

interface ReportGeneratorProps {
  reportData: ReportData;
  onBackToChat: () => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ reportData, onBackToChat }) => {
  const [editedSummary, setEditedSummary] = useState(reportData.summary);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [emailLink, setEmailLink] = useState('');

  useEffect(() => {
    setEditedSummary(reportData.summary);
    setSelectedRecipients([]);
  }, [reportData]);
  
  useEffect(() => {
    const subject = "Incident Report";
    const body = encodeURIComponent(editedSummary);
    const recipients = selectedRecipients.join(',');
    setEmailLink(`mailto:${recipients}?subject=${subject}&body=${body}`);
  }, [editedSummary, selectedRecipients]);

  const handleRecipientToggle = (contact: string) => {
    setSelectedRecipients(prev => 
      prev.includes(contact)
        ? prev.filter(c => c !== contact)
        : [...prev, contact]
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-lg shadow-xl animate-fade-in">
        <div className="flex justify-between items-start mb-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Draft Incident Report</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Review, edit, and select recipients for your report.</p>
            </div>
            <button onClick={onBackToChat} className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
                &larr; Back to Chat
            </button>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="summary" className="block text-lg font-semibold text-slate-700 dark:text-slate-300">1. Your Report Summary</label>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">This summary was generated from your chat. Please read it carefully and make any necessary edits for accuracy.</p>
          <textarea
            id="summary"
            value={editedSummary}
            onChange={(e) => setEditedSummary(e.target.value)}
            className="w-full h-64 p-3 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200"
          />
        </div>

        <div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">2. Suggested Recipients</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Select who you'd like to send this report to. You can select multiple options.</p>
            <div className="space-y-3">
                {reportData.recipients.map((recipient, index) => (
                    <div key={index} className="flex items-start p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <input
                            type="checkbox"
                            id={`recipient-${index}`}
                            checked={selectedRecipients.includes(recipient.contact)}
                            onChange={() => handleRecipientToggle(recipient.contact)}
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1 cursor-pointer"
                        />
                        <label htmlFor={`recipient-${index}`} className="ml-3 text-sm flex-1 cursor-pointer">
                            <p className="font-bold text-slate-800 dark:text-slate-200">{recipient.category}</p>
                            <p className="text-slate-600 dark:text-slate-300">{recipient.contact}</p>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">{recipient.reason}</p>
                        </label>
                    </div>
                ))}
            </div>
        </div>

        <div>
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">3. Send Your Report</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                Clicking this button will open your default email client with the report and recipients pre-filled. 
                <span className="font-semibold"> Your report will not be sent automatically.</span> You have full control to review it one last time before sending.
            </p>
            <a
                href={selectedRecipients.length > 0 ? emailLink : undefined}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${selectedRecipients.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-disabled={selectedRecipients.length === 0}
                onClick={(e) => { if (selectedRecipients.length === 0) e.preventDefault(); }}
            >
                <MailIcon className="w-5 h-5 mr-2"/>
                Open in Email Client
            </a>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
