import { useState, useEffect, useCallback } from 'react'
import { useGlobalContext } from '../../context.jsx'
import { CommentData, CommentFeedData, DeleteCommentData } from '../../js/networkReq.js'

const CommentsModal = ({postId, updateHomeComments}) => {
    const { closeModal, state } = useGlobalContext()

	const [text, setText] = useState("")
	const [comments, setComments] = useState([])

	const fetchComments = useCallback(async () => {
        try {
            const result = await CommentFeedData(postId)
            if (result) {
				setComments(result.comments)
            }
            else {
                setComments([])
            }
        }
        catch (err) {
            console.log(err)
        }
    }, [postId])

	const submitComment = async (e) => {
		try {
			e.preventDefault()
			const result = await CommentData(text, postId)
			if (result) {
                setComments(result.comments)
				updateHomeComments(result)
            }
            else {
                setComments([])
            }
		}
		catch (err) {
			console.log(err)
		}
	}

	const deleteComment = async (e, commentId) => {
		try {
			e.preventDefault()
			const result = await DeleteCommentData(postId, commentId)
			if (result) {
				setComments(result.comments)
				updateHomeComments(result)
			}
			else {
				setComments([])
			}
		}
		catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		fetchComments()
	}, [fetchComments])

    return (
		<div className="modal-overlay">
			<div className="reveal modal grid-x" id="modal">
				<div className="cell modal-options">
					<button onClick={()=>closeModal()} className="button" data-tooltip  data-disable-hover="false" tabIndex="2" title="Close the modal">
						<i className="fa fa-xmark" aria-hidden="true"></i>
						<span className="show-for-sr">Close the modal</span>
					</button>
				</div>
				<div className="cell modal-inner">
					{
						(comments?
							comments.map((comment) => {
							const { name, _id:id } = comment.postedBy
							const { text, commentId } = comment
							return (
								<div className="comment row" key={commentId}>
									<p className="small-3 comment-name">{name}</p>
									<p className="shrink">{text} {state._id === id && <span className="comment-delete" onClick={(e) => deleteComment(e, commentId)}>Delete?</span>}</p>
								</div>
							)
							})
						:<h5>Loading...</h5>)
					}
				</div>
				<div className="cell comment-input">
					<input type="text" placeholder="Enter your comment"  maxLength={180} onChange={(e)=>setText(e.target.value)}/>
					<button className="button" data-tooltip  data-disable-hover="false" tabIndex="2" title="Submit your comment" onClick={(e)=>submitComment(e)}>
						<i className="fa fa-paper-plane" aria-hidden="true"></i>
						<span className="show-for-sr">Submit your comment</span>
					</button>
				</div>
			</div>
		</div>
    )
}
export default CommentsModal
