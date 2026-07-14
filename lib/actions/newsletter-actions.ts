'use server';

export interface ActionState {
  success?: boolean;
  error?: string;
  message?: string;
}

export async function subscribeToNewsletter(
  _prevState: ActionState | null,
  _formData: FormData,
): Promise<ActionState> {
  return { success: true, message: 'Subscribed successfully (mock).' };
}
