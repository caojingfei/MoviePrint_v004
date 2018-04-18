import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { arrayMove } from 'react-sortable-hoc';
import scrollIntoView from 'scroll-into-view';
import {
  toggleThumb, updateOrder, removeThumb, updateObjectUrlsFromThumbList,
  changeThumb, addDefaultThumbs, zoomIn, zoomOut
} from '../actions';
import styles from '../components/ThumbGrid.css';
import SortableThumbGrid from '../components/ThumbGrid';
import { getNextThumb, getPreviousThumb, getLowestFrame, getHighestFrame, getChangeThumbStep, getVisibleThumbs } from '../utils/utils';
import saveThumb from '../utils/saveThumb';

class SortedVisibleThumbGrid extends Component {
  constructor(props) {
    super(props);
    console.log(React.version);
    // this.scrollIntoViewElement = null;
    this.scrollIntoViewElement = React.createRef();

    this.scrollThumbIntoView = this.scrollThumbIntoView.bind(this);
    this.onSelectClick = this.onSelectClick.bind(this);
  }

  componentDidMount() {
    console.log(this.props);
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
    store.getState().undoGroup.present.files.map((singleFile) => {
      if (store.getState().undoGroup.present.thumbsByFileId[singleFile.id] !== undefined) {
        store.dispatch(updateObjectUrlsFromThumbList(
          singleFile.id,
          Object.values(store.getState().undoGroup.present
            .thumbsByFileId[singleFile.id]
            .thumbs).map((a) => a.frameId)
        ));
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedThumbId !== this.props.selectedThumbId) {
      this.scrollThumbIntoView();
    }
    // only delay when switching to thumbView
    if (prevProps.zoomOut !== this.props.zoomOut && prevProps.zoomOut) {
      setTimeout(() => {
        this.scrollThumbIntoView();
      }, 500);
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { store } = this.context;
    const newOrderedThumbs = arrayMove(store.getState().undoGroup.present
      .thumbsByFileId[store.getState().undoGroup.present.settings.currentFileId]
      .thumbs, oldIndex, newIndex);
    store.dispatch(updateOrder(store.getState()
      .undoGroup.present.settings.currentFileId, newOrderedThumbs));
  };

  onSelectClick = (thumbId, frameNumber) => {
    this.props.selectMethod(thumbId, frameNumber);
  }

  scrollThumbIntoView = () => {
    if (this.scrollIntoViewElement && this.scrollIntoViewElement.current !== null) {
      // console.log(this.scrollIntoViewElement);
      scrollIntoView(this.scrollIntoViewElement.current, {
        time: 300,
        align: {
          left: 0.5,
        }
      });
    }
  };

  render() {
    return (
      <SortableThumbGrid
        ref={this.props.inputRef} // for the saveMoviePrint function
        inputRefThumb={this.scrollIntoViewElement} // for the thumb scrollIntoView function
        // inputRefThumb={this.props.inputRefThumb} // for the thumb scrollIntoView function
        showSettings={this.props.showSettings}
        colorArray={this.props.colorArray}
        thumbs={this.props.thumbs}
        thumbImages={this.props.thumbImages}
        file={this.props.file}
        settings={this.props.settings}
        selectedThumbId={this.props.selectedThumbId}
        onSelectClick={this.onSelectClick}
        onThumbDoubleClick={this.props.onThumbDoubleClick}
        onToggleClick={this.props.onToggleClick}
        onRemoveClick={this.props.onRemoveClick}
        onBackClick={this.props.onBackClick}
        onForwardClick={this.props.onForwardClick}
        onInPointClick={this.props.onInPointClick}
        onOutPointClick={this.props.onOutPointClick}
        onSaveThumbClick={this.props.onSaveThumbClick}
        onBackClick={this.props.onBackClick}
        onForwardClick={this.props.onForwardClick}
        onScrubClick={this.props.onScrubClick}
        onMouseOverResult={(thumbId) => {
          this.controlersVisible = thumbId;
          this.forceUpdate();
        }}
        onMouseOutResult={() => {
          this.controlersVisible = 'false';
        }}
        onSortEnd={
          this.onSortEnd.bind(this)
        }
        useDragHandle
        axis="xy"
        // pressDelay={250}
        distance={1}
        helperClass={styles.whileDragging}
        controlersAreVisibleId={this.controlersVisible}
        useWindowAsScrollContainer={true}

        columnCount={this.props.columnCount}
        thumbCount={this.props.thumbCount}
        reCapture={this.props.reCapture}
        containerWidth={this.props.containerWidth || 640}
        containerHeight={this.props.containerHeight || 360}
        zoomOut={this.props.zoomOut}
        scaleValueObject={this.props.scaleValueObject}
      />
    );
  }
}

const mapStateToProps = state => {
  const tempThumbs = (state.undoGroup.present
    .thumbsByFileId[state.undoGroup.present.settings.currentFileId] === undefined)
    ? undefined : state.undoGroup.present
      .thumbsByFileId[state.undoGroup.present.settings.currentFileId].thumbs;
  return {
    thumbs: getVisibleThumbs(
      tempThumbs,
      state.visibilitySettings.visibilityFilter
    ),
    thumbImages: (state.thumbsObjUrls[state.undoGroup.present.settings.currentFileId] === undefined)
      ? undefined : state.thumbsObjUrls[state.undoGroup.present.settings.currentFileId],
    files: state.undoGroup.present.files,
    file: state.undoGroup.present.files.find((file) =>
      file.id === state.undoGroup.present.settings.currentFileId),
    settings: state.undoGroup.present.settings,
    visibilitySettings: state.visibilitySettings
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    // onViewToggle: () => {
    //   console.log(ownProps);
    //   if (ownProps.zoomOut) {
    //     dispatch(zoomIn());
    //   } else {
    //     dispatch(zoomOut());
    //   }
    // },
    onToggleClick: (fileId, thumbId) => {
      dispatch(toggleThumb(fileId, thumbId));
    },
    onRemoveClick: (fileId, thumbId) => {
      dispatch(removeThumb(fileId, thumbId));
    },
    onInPointClick: (file, thumbs, thumbId, frameNumber) => {
      dispatch(addDefaultThumbs(
        file,
        thumbs.length,
        frameNumber,
        getHighestFrame(thumbs)
      ));
    },
    onOutPointClick: (file, thumbs, thumbId, frameNumber) => {
      dispatch(addDefaultThumbs(
        file,
        thumbs.length,
        getLowestFrame(thumbs),
        frameNumber
      ));
      // getPreviousThumb(thumbs, thumbId);
    },
    onSaveThumbClick: (fileName, frameNumber, frameId) => {
      console.log(fileName);
      console.log(frameNumber);
      console.log(frameId);
      saveThumb(fileName, frameNumber, frameId);
    },
    onBackClick: (file, thumbId, frameNumber) => {
      dispatch(changeThumb(file, thumbId, frameNumber - getChangeThumbStep(1)));
    },
    onForwardClick: (file, thumbId, frameNumber) => {
      dispatch(changeThumb(file, thumbId, frameNumber + getChangeThumbStep(1)));
    },
    onScrubClick: (file, thumbId, frameNumber) => {
      ownProps.parentMethod(file, thumbId, frameNumber);
    }
  };
};

SortedVisibleThumbGrid.contextTypes = {
  store: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(SortedVisibleThumbGrid);
