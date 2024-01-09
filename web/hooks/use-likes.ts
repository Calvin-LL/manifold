import { Reaction, ReactionContentTypes } from 'common/reaction'
import { db } from 'web/lib/supabase/db'
import { useEffect, useState } from 'react'
import { run } from 'common/supabase/utils'
import { usePersistentInMemoryState } from './use-persistent-in-memory-state'

export const useLikesOnContent = (
  contentType: ReactionContentTypes,
  contentId: string
) => {
  const [likes, setLikes] = usePersistentInMemoryState<Reaction[] | undefined>(
    undefined,
    `${contentType}-likes-on-${contentId}`
  )

  useEffect(() => {
    run(
      db
        .from('user_reactions')
        .select()
        .eq('type', 'like')
        .eq('contentType', contentType)
        .eq('contentId', contentId)
    ).then(({ data }) => setLikes(data.map((d) => d.data) as Reaction[]))
  }, [contentType, contentId])

  return likes
}

export const useIsLiked = (
  userId: string | undefined,
  contentType: ReactionContentTypes,
  contentId: string
) => {
  const [liked, setLiked] = useState<boolean>()

  useEffect(() => {
    if (userId)
      run(
        db
          .from('user_reactions')
          .select()
          .eq('user_id', userId)
          .eq('type', 'like')
          .eq('contentId', contentId)
      ).then(({ data }) => {
        setLiked(!!data.length)
      })
  }, [userId, contentType, contentId])

  return liked
}
