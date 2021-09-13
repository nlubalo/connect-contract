import React from "react";
import "./Post.css";

function Post({ displayID, timestamp, message }) {
  return (
    <div className="post">
  
      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3>
              {displayID}{" "}
              <span className="post__headerSpecial">
                <div className="post__badge" /> @
                {timestamp}
              </span>
            </h3>
          </div>
          <div className="post__headerDescription">
            <p>{message}</p>
          </div>
        </div>
        <div className="post__footer">
        
        </div>
      </div>
    </div>
  );
}

export default Post;