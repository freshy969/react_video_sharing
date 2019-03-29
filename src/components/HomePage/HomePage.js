import React from "react";
import { connect } from "react-redux";

import VideoSection from "components/HomePage/VideoSection";
import { startGetRecommendedVideo, startGetVideos } from "actions";

export class HomePage extends React.Component{

  state = {
    loading: true
  };

  componentDidMount = () => {
    const { getRecommendedVideo, getVideos, offset } = this.props;

    const getRecommendedVideoPromise = getRecommendedVideo();
    const getVideosPromise = getVideos({ offset });

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
               <VideoSection type="Recommended" header />
               <VideoSection scrollable type="Featured" header/>
              </div>
            </div>
          </div>
        </div>
    )
  }
}

const mapStateToProps = (state) => ({
  offset: state.video.featured.offset,
});

const mapDispatchToProps = (dispatch) => ({
    getRecommendedVideo: () => dispatch(startGetRecommendedVideo()),
    getVideos: (options) => dispatch(startGetVideos(options)),
});

export default connect(mapStateToProps,mapDispatchToProps)(HomePage);
