export type Reaction = {
  id: string
  contentId: string // will be id of the content liked, i.e. contract.id, comment.id, etc.
  contentType: ReactionContentTypes
  type: ReactionTypes
  createdTime: number

  // The liker
  userId: string

  // The owner of the liked content
  contentOwnerId: string
}
export type ReactionContentTypes = 'contract' | 'comment'
export type ReactionTypes = 'like'
