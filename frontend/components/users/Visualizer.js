import React from 'react';
import Loading from '../shared/Loading';
import UserPreview from '../newsfeed/UserPreview';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import Login from './Login';
import ErrorMessage from '../shared/ErrorMessage';

/**
 * Component rendered when the URL entered by a user is not found
 */
class Visualizer extends React.Component {
  // Constructor method
  constructor(props) {
    super(props);

    // Set the state
    this.state = {
      pending: true,
      error: "",
      data: {},
    };
  }

  // Load suggestions
  componentDidMount() {
    // Make the API request
    axios.get("/api/visualizer")
      .then(res => {
        if (res.data.success) {
          this.setState({
            pending: false,
            data: res.data.data,
            error: "",
          });
        } else {
          this.setState({
            pending: false,
            error: res.data.error,
          });
        }
      })
      .catch(err => {
        this.setState({
          pending: false,
          error: err,
        });
      });
  }

  // Helper function to render the hypertree
  renderTree() {
    // Create the tree
    var ht = new $jit.Hypertree({
      // Id of the visualization container
      injectInto: 'vis',

      // Canvas width and height
      width: 600,
      height: 600,

      // Change node and edge styles such as
      // color, width and dimensions.
      Node: {
        dim: 12,
        color: "#8898aa"
      },
      Edge: {
        lineWidth: 3,
        color: "#c3d1e2"
      },
      onBeforeCompute: () => {},

      // Attach event handlers and add text to the
      // labels. This method is only triggered on label
      // creation
      onCreateLabel: (domElement, node) => {
        domElement.innerHTML = node.name;
        $jit.util.addEvent(domElement, 'click', () => {
          ht.onClick(node.id, {
            onComplete: () => {
              ht.controller.onComplete();
            }
          });
        });
      },

      // Change node styles when labels are placed or moved.
      onPlaceLabel: (domElement, node) => {
        var style = domElement.style;
        style.display = '';
        style.cursor = 'pointer';
        if (node._depth <= 1) {
          style.fontSize = "0.8em";
          style.color = "#ddd";
        } else if (node._depth === 2) {
          style.fontSize = "0.7em";
          style.color = "#555";
        } else {
          style.display = 'none';
        }

        var left = parseInt(style.left, 10);
        var w = domElement.offsetWidth;
        style.left = (left - w / 2) + 'px';
      },

      onComplete: () => {
        // Build the right column relations list.
        // This is done by collecting the information (stored in the data property)
        // for all the nodes adjacent to the centered node.
        var node = ht.graph.getClosestNodeToOrigin("current");
        var html = "<h4>" + node.name + "</h4><b>Connections:</b>";
        html += "<ul>";
        node.eachAdjacency((adj) => {
          var child = adj.nodeTo;
          if (child.data) {
            var rel = (child.data.affiliation === node.data.affiliation) ? child.data.affiliation : "Friends";
            html += "<li>" + child.name + " " + "<div class=\"relation\">(relation: " + rel + ")</div></li>";
          }
        });
        html += "</ul>";
        document.getElementById('details').innerHTML = html;
      }
    });

    // Load JSON data.
    ht.loadJSON(this.state.data);

    // Compute positions and plot.
    ht.refresh();
  }

  // Render the component
  render() {
    if (!this.props.username) {
      // If the user is not logged in
      return (<Login notice="You must be logged in to view this page." />);
    }

    // If the user is logged in
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2">
            <div className="card marg-top-1">
              <h3 className="bold">
                Friend visualization
              </h3>
              {
                this.state.error && <ErrorMessage text={ this.state.error } />
              }
              {
                this.state.pending ? <Loading /> : this.renderTree()
              }
              <div id="vis" />
              <div id="details" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Visualizer.propTypes = {
  match: PropTypes.object,
  username: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    username: state.userState.username,
  };
};

const mapDispatchToProps = () => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Visualizer);
