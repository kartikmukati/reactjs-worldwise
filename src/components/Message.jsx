import styles from "./Message.module.css";

function Message(prop) {

  const {message} = prop;

  return (
    <p className={styles.message}>
      <span role="img">👋</span> {message}
    </p>
  );
}

export default Message;
