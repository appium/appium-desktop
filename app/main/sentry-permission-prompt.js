import { dialog } from 'electron';
import settings from 'electron-settings';

const SENTRY_USER_ANSWERED_PROMPT = 'SENTRY_USER_ANSWERED_PROMPT';
const SENTRY_PERMISSION_ALLOWED = 'SENTRY_PERMISSION_ALLOWED';

export async function promptUser () {
  // Ask user for permission to use Sentry crash reporter
  const userAnsweredPrompt = await settings.get(SENTRY_USER_ANSWERED_PROMPT);

  if (!userAnsweredPrompt) {
    dialog.showMessageBox({
      type: 'info',
      buttons: ['Yes', 'No'],
      message: `Can Appium Desktop collect crash log data from you to help improve the product?`,
    }, async (response) => {
      await settings.set(SENTRY_PERMISSION_ALLOWED, response === 0 ? true : false);
      await settings.set(SENTRY_USER_ANSWERED_PROMPT, true);
    });
  }
}
