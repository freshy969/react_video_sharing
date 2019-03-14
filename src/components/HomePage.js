import React from "react";
import { connect } from "react-redux";

import VideoSection from "./VideoSection";
import { startGetRecommendedVideo, startGetVideos } from "../actions";

export class HomePage extends React.Component{

  state = {
    loading: true
  };

  componentDidMount = () => {
    const { getRecommendedVideo, getVideos } = this.props;

    const getRecommendedVideoPromise = getRecommendedVideo();
    const getVideosPromise = getVideos({});

    Promise.all([ getRecommendedVideoPromise , getVideosPromise ])
        .then(res => {
          if(res[0].error === false && res[1].error === false) this.setState({ loading: false });
        })
        .catch(err => console.log(err));
  };

  render(){
    const { loading } = this.state;

    // temp loading..
    if(loading) return <div>Loading...</div>;

    return (
        <div className="content-wrapper">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
               <VideoSection type="Recommended" />
               <VideoSection type="Featured"/>
              </div>
            </div>
          </div>
        </div>
    )
  }
}

const mapStateToProps = (state) => ({
  offset: state.video.featured.offset
});

const mapDispatchToProps = (dispatch) => {
  return {
    getRecommendedVideo: (callback) => dispatch(startGetRecommendedVideo(callback)),
    getVideos: (options, callback) => dispatch(startGetVideos(options, callback)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
