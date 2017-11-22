import React from 'react';
import Medium from '../shared/Medium';
import StatusForm from '../newsfeed/StatusForm';

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
              <div className="col-12 col-md-4">
                <div className="space-4"></div>
                <h4>
                  More about me
                </h4>
                <p>
                  This is some cool stuff
                </p>
              </div>
              <div className="col-12 col-md-8">
                <StatusForm placeholder="Write on this user's wall" />

                <div className="card">
                  <h1>User profile</h1>
                  <p>
                    This is an example user profile
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
