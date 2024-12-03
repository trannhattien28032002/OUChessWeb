import { useEffect, useState } from "react";
import { socket } from "src/index";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { RootState } from "src/app/store";
import { profileActions } from "src/redux/reducer/profile/Profile";
import CommentInfoItem from "src/share/comment/CommentInfoItem";
import "src/share/comment/Comment.scss";

type Props = object;

const CommentInfoList = (props: Props) => {
    // const { comments } = props;
    const comments = useAppSelector((state: RootState) => state.profileReducer.comments);
    const profile = useAppSelector((state: RootState) => state.profileReducer.profile);
    const currentUser = useAppSelector((state: RootState) => state.userReducer.currentUser);
    const dispatch = useAppDispatch();
    const [comment, setComment] = useState<string>("");

    const handlerSubmit = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (comment.trim() !== "") {
            socket.emit("newComment", {
                content: comment,
                receiver: {
                    _id: profile._id,
                    username: profile.username,
                    avatar: profile.avatar,
                },
                sender: {
                    _id: currentUser._id,
                    username: currentUser.username,
                    avatar: currentUser.avatar,
                },
            });
            setComment("");
        }
    };

    useEffect(() => {
        socket.on("newComment", (comment) => {
            dispatch(profileActions.postAddCommentInfo({ comment }));
        });

        return () => {
            socket.off("newComment");
        };
    }, []);

    useEffect(() => {
        socket.on("error_msg", (status) => {
            console.log(status);
        });

        return () => {
            socket.off("error_msg");
        };
    }, []);

    useEffect(() => {
        console.log(comments.length);
    }, [comments]);

    return (
        <>
            <div style={{ overflow: "auto", maxHeight: "240px" }}>
                {comments.length === 0 && <div style={{ color: "#9e9e9e", padding: "5px", margin: "auto" }} >Không có bất kỳ lời nhận xét nào</div>}
                {comments.map((m) => {
                    return <CommentInfoItem key={m.sender._id} comment={m} />;
                })}
            </div>

            {profile.username !== currentUser.username && (
                <form className="ci-form" onSubmit={handlerSubmit}>
                    <input type="text" value={comment} onChange={(evt) => setComment(evt.target.value)} />
                    <button type="submit">Gửi</button>
                </form>
            )}
        </>
    );
};

export default CommentInfoList;
