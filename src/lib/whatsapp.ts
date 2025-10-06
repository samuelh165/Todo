/**
 * WhatsApp Cloud API Client
 * Handles sending and receiving messages via Meta's WhatsApp Cloud API
 */

const WHATSAPP_API_URL = 'https://graph.facebook.com/v21.0';

export interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  text?: {
    body: string;
  };
  type: 'text' | 'image' | 'audio' | 'video' | 'document';
}

export interface WhatsAppWebhookEntry {
  id: string;
  changes: Array<{
    value: {
      messaging_product: string;
      metadata: {
        display_phone_number: string;
        phone_number_id: string;
      };
      contacts?: Array<{
        profile: {
          name: string;
        };
        wa_id: string;
      }>;
      messages?: WhatsAppMessage[];
    };
    field: string;
  }>;
}

export class WhatsAppClient {
  private accessToken: string;
  private phoneNumberId: string;

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';

    if (!this.accessToken || !this.phoneNumberId) {
      console.warn('WhatsApp credentials not configured');
    }
  }

  /**
   * Send a text message to a WhatsApp user
   */
  async sendMessage(to: string, message: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${WHATSAPP_API_URL}/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to,
            type: 'text',
            text: {
              preview_url: false,
              body: message,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('WhatsApp API error:', error);
        return false;
      }

      const data = await response.json();
      console.log('Message sent successfully:', data);
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      return false;
    }
  }

  /**
   * Send a reaction to a message
   */
  async sendReaction(
    to: string,
    messageId: string,
    emoji: string
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${WHATSAPP_API_URL}/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: to,
            type: 'reaction',
            reaction: {
              message_id: messageId,
              emoji: emoji,
            },
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('WhatsApp reaction error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending reaction:', error);
      return false;
    }
  }

  /**
   * Mark a message as read
   */
  async markAsRead(messageId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${WHATSAPP_API_URL}/${this.phoneNumberId}/messages`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            status: 'read',
            message_id: messageId,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('WhatsApp mark as read error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  }

  /**
   * Format a phone number for WhatsApp (remove special characters)
   */
  formatPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/[^0-9]/g, '');
  }
}

export const whatsappClient = new WhatsAppClient();

