// in src/MyMenu.js
import React from 'react';
import { connect } from 'react-redux';
import { MenuItemLink, getResources, Responsive } from 'react-admin';
import { withRouter } from 'react-router-dom';

const MyMenu = ({ resources, onMenuClick, logout }) => {
    return(
      <div>
          {resources.map(resource => (
            resource.hasList &&
              <MenuItemLink
                  key={resource.name}
                  to={`/${resource.name}`}
                  primaryText={resource.options && resource.options.label || resource.name}
                  onClick={onMenuClick}
              />
          ))}
          <MenuItemLink to="/boxmap" primaryText="box charts" onClick={onMenuClick} />
          <Responsive
              small={logout}
              medium={null} // Pass null to render nothing on larger devices
          />
      </div>
  );
}
const mapStateToProps = state => ({
    resources: getResources(state),
});

export default withRouter(connect(mapStateToProps)(MyMenu));
