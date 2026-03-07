/**
 * Notification Service for FlyBook
 * Handles Browser Web Notifications and provides a structure for FCM integration.
 */

export class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';

  private constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Request permission from the user to show notifications
   */
  public async requestPermission(): Promise<boolean> {
    console.log('Requesting notification permission...');
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.warn('This browser does not support notifications.');
      return false;
    }

    if (Notification.permission === 'granted') {
      console.log('Notification permission already granted.');
      this.permission = 'granted';
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission result:', permission);
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Display an immediate notification
   */
  public showNotification(title: string, options?: NotificationOptions) {
    console.log('Attempting to show notification:', title);
    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted. Current state:', this.permission);
      return;
    }

    const defaultOptions: NotificationOptions = {
      icon: 'https://ais-dev-dsoscwtkqsb74h76fletr3-361430282127.europe-west2.run.app/favicon.ico', // Fallback to app icon
      badge: 'https://ais-dev-dsoscwtkqsb74h76fletr3-361430282127.europe-west2.run.app/favicon.ico',
      ...options
    };

    const notification = new Notification(title, defaultOptions);

    notification.onclick = (event) => {
      event.preventDefault();
      window.focus();
      // In a real app, you might use a router to navigate
      // window.location.href = '/trips'; 
      console.log('Notification clicked:', title);
    };
  }

  /**
   * Schedule a notification for later (Simulated for Web)
   * In a real production app, this would be handled by a Service Worker or Backend Push
   */
  public scheduleNotification(title: string, delayMs: number, options?: NotificationOptions) {
    setTimeout(() => {
      this.showNotification(title, options);
    }, delayMs);
  }

  /**
   * Mock for FCM (Firebase Cloud Messaging) integration
   * This structure shows how you would handle push tokens and incoming messages
   */
  public async initFCM() {
    console.log('FCM Initialization: In a real mobile environment (React Native), you would use @react-native-firebase/messaging');
    // 1. Request permission
    // 2. Get FCM token
    // 3. Listen for foreground messages
    // 4. Handle background/quit state messages
  }
}

export const notificationService = NotificationService.getInstance();
