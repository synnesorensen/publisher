import { MimirMessage, PluginLoadedMessage, SaveMetadataMessage, UpdateMetadataMessage } from '../types/types';

class MimirCommunication {
  private origin: string | null = null;

  constructor() {
    // Extract origin from URL parameters if available
    const urlParams = new URLSearchParams(window.location.search);
    this.origin = urlParams.get('origin');
    
    if (!this.origin) {
      console.warn('No origin found in URL parameters');
    }
  }

  /**
   * Setup message listener
   * @param callback Function to call when a message is received
   */
  setupMessageListener(callback: (message: MimirMessage) => void): void {
    window.addEventListener('message', (event) => {
      // Verify origin if available
      if (this.origin && event.origin !== this.origin) {
        console.warn(`Message received from unauthorized origin: ${event.origin}`);
        return;
      }

      // Handle message
      if (typeof event.data === 'object') {
        callback(event.data);
      } else {
        try {
          const parsedData = JSON.parse(event.data);
          callback(parsedData);
        } catch (error) {
          console.error('Failed to parse message data:', error);
        }
      }
    });
  }

  /**
   * Send message to parent window
   * @param message Message to send
   */
  sendMessage(message: MimirMessage): void {
    if (!this.origin) {
      console.warn('Cannot send message: origin not set');
      return;
    }

    window.parent.postMessage(message, this.origin);
  }

  /**
   * Send plugin loaded message
   */
  sendPluginLoaded(): void {
    const message: PluginLoadedMessage = {
      action: 'plugin_loaded'
    };
    this.sendMessage(message);
  }

  /**
   * Send save metadata message
   */
  sendSaveMetadata(): void {
    const message: SaveMetadataMessage = {
      action: 'save_metadata'
    };
    this.sendMessage(message);
  }

  /**
   * Send update metadata message
   * @param formId Form ID
   * @param formData Form data
   */
  sendUpdateMetadata(formId: string, formData: Record<string, any>): void {
    const message: UpdateMetadataMessage = {
      action: 'update_metadata',
      payload: {
        formId,
        formData
      }
    };
    this.sendMessage(message);
  }
}

// Export singleton instance
export const mimirCommunication = new MimirCommunication();