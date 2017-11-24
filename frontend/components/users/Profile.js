import React from 'react';
import Medium from '../shared/Medium';
import StatusForm from '../newsfeed/StatusForm';
import Status from '../newsfeed/Status';

/**
 * Render's a user's profile
 *
 * Cover photo and profile picture at the top
 * Information about the user (bio, interests, friend count, etc.) to left
 * List of posts and ability to write on their wall to the right / middle
 */
const Profile = () => {
  return (
    <div className="profile">
      <div className="cover-photo"></div>
      <div className="menu">
        <h3>Cameron Cabo</h3>
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-12 col-lg-10 offset-lg-1">
            <div className="profile-picture"></div>

            <div className="row">
              <div className="col-12 col-md-4 about">
                <strong>
                  Learn more
                </strong>
                <p>
                  This is my biography
                </p>
                <strong>
                  Interests
                </strong>
                <ul className="tags">
                  <li>NETS 212</li>
                  <li>Scalable cloud computing</li>
                  <li>Computer science</li>
                </ul>
                <p>
                  <strong>Friends:</strong> 212
                </p>
                <p>
                  <strong>Posts:</strong> 41
                </p>
              </div>
              <div className="col-12 col-md-8 col-lg-7">
                <StatusForm placeholder="Write on this user's wall" />

                <Status
                  name="Terry Jo"
                  status="I'm a fool loool"
                  userImg="https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/15585239_1133593586737791_6146771975815537560_o.jpg?oh=1f5bfe8e714b99b823263e2db7fa3329&oe=5A88DA92"
                  id="1"
                />

                <Status
                  name="Terry Jo"
                  status="Look at this dog"
                  userImg="https://scontent-lga3-1.xx.fbcdn.net/v/t31.0-8/15585239_1133593586737791_6146771975815537560_o.jpg?oh=1f5bfe8e714b99b823263e2db7fa3329&oe=5A88DA92"
                  id="1"
                  image="http://www.insidedogsworld.com/wp-content/uploads/2016/03/Dog-Pictures.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
