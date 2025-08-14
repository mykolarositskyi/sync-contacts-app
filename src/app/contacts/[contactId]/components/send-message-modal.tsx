'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { X, Send, MessageSquare, Mail } from "lucide-react";
import { toast } from "sonner";

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
}

export function SendMessageModal({ isOpen, onClose, contactName }: SendMessageModalProps) {
  const [messageType, setMessageType] = useState<'sms' | 'email'>('email');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    
    // Show success message
    toast.success(`Message sent successfully to ${contactName}!`);
    
    // Reset form and close modal
    setTitle('');
    setDescription('');
    onClose();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setTitle('');
      setDescription('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black rounded-3xl border-2 border-gray-200 dark:border-gray-800 shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b-2 border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-5 h-5 text-white dark:text-black" />
            </div>
            <h2 className="text-xl font-bold text-black dark:text-white">Send Message</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-10 h-10 p-0 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Message Type Selection */}
          <div>
            <Label className="block text-sm font-semibold text-black dark:text-white mb-4">
              Message Type
            </Label>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant={messageType === 'email' ? 'default' : 'outline'}
                onClick={() => setMessageType('email')}
                className={`flex-1 flex items-center justify-center px-6 py-4 rounded-xl border-2 transition-all duration-200 ${
                  messageType === 'email'
                    ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-lg'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg'
                }`}
              >
                <Mail className="w-5 h-5 mr-2" />
                Email
              </Button>
              <Button
                type="button"
                variant={messageType === 'sms' ? 'default' : 'outline'}
                onClick={() => setMessageType('sms')}
                className={`flex-1 flex items-center justify-center px-6 py-4 rounded-xl border-2 transition-all duration-200 ${
                  messageType === 'sms'
                    ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-lg'
                    : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-lg'
                }`}
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                SMS
              </Button>
            </div>
          </div>

          {/* Title Field */}
          <FormField label="Title" htmlFor="title">
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Enter ${messageType === 'email' ? 'email' : 'SMS'} title`}
              disabled={isSubmitting}
            />
          </FormField>

          {/* Description Field */}
          <FormField label="Description" htmlFor="description">
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Enter ${messageType === 'email' ? 'email' : 'SMS'} description`}
              rows={4}
              disabled={isSubmitting}
            />
          </FormField>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 text-sm font-semibold text-white dark:text-black bg-black dark:bg-white border-2 border-black dark:border-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white dark:border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send {messageType === 'email' ? 'Email' : 'SMS'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
