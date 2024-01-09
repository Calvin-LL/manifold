import { createSupabaseClient } from 'shared/supabase/init'
import { APIError, APIHandler } from './helpers/endpoint'
import { createLikeNotification } from 'shared/create-notification'

export const addOrRemoveReaction: APIHandler<'react'> = async (props, auth) => {
  const { contentId, contentType, remove } = props
  const userId = auth.uid

  const db = createSupabaseClient()

  if (remove) {
    const { data, error } = await db
      .from('reactions')
      .select('*')
      .eq('contentId', contentId)
      .eq('contentType', contentType)
      .eq('userId', userId)

    if (error) {
      throw new APIError(500, 'Failed to remove reaction: ' + error.message)
    }

    if (data.length) {
      const reaction = data[0]
      await db.from('reactions').delete().eq('id', reaction.data)
    }
  } else {
    const { data } = await db
      .from('reactions')
      .upsert({
        contentId,
        contentType,
        user_id: userId,
      })
      .returns()

    // TODO: check that like doesn't already exist, and don't notify if it does
    await createLikeNotification(data as any)
  }
}
