import styles from "./CommentForm.module.scss";

export const CommentForm = () => {
    return (
        <div>
            <input style={{height: 20}} type="text" placeholder="Say something!"/>
            <button type="submit">Publish</button>
        </div>
    )
}

export default CommentForm;