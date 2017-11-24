import React from 'react';
import UserPreview from './UserPreview';

/**
 * Component to render which of your friends are currently online.
 */
const OnlineNow = () => (
  <div className="card pad-bot-025">
    <strong className="marg-bot-05">
      Online now
    </strong>
    <UserPreview
      name="Terry Jo"
      id="153"
      img="https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/15585239_1133593586737791_6146771975815537560_o.jpg?oh=1f5bfe8e714b99b823263e2db7fa3329&oe=5A88DA92"
      isOnline={ true }
    />
    <UserPreview
      name="Victor Chien"
      id="12"
      isOnline={ true }
    />
    <UserPreview
      name="Cameron Cabo"
      id="8"
      isOnline={ true }
    />
  </div>
);

export default OnlineNow;
