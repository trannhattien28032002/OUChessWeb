import { CommentInfo } from "src/redux/reducer/profile/Types";

type Props = {
    comment: CommentInfo;
};

const CommentInfoItem = (props: Props) => {
    const { comment } = props;
    return (
        <>
            <div className="comment-info-item">
                <div className="ci-item-avatar">
                    <img src={comment.sender.avatar} alt="avatar" />
                </div>

                <div className="ci-sub">
                    <div className="ci-item-info">{comment.sender.username}</div>
                    <div className="ci-item-content">{comment.content}</div>
                </div>
            </div>
        </>
    );
};

export default CommentInfoItem;
