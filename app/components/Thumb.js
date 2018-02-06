// @flow
import React from 'react';
import PropTypes from 'prop-types';
import { SortableHandle } from 'react-sortable-hoc';
import styles from './ThumbGrid.css';

import inPoint from './../img/Thumb_IN.png';
import outPoint from './../img/Thumb_OUT.png';
import back from './../img/Thumb_BACK.png';
import forward from './../img/Thumb_FORWARD.png';
import scrub from './../img/Thumb_SCRUB.png';
import handle from './../img/Thumb_HANDLE.png';
import hide from './../img/Thumb_HIDE.png';
import show from './../img/Thumb_SHOW.png';
import empty from './../img/Thumb_EMPTY.png';

import imageDB from './../utils/db';



const DragHandle = SortableHandle(() => {
  function over(event){
    event.target.style.opacity = 1;
  }
  function out(event){
    event.target.style.opacity = 0.3;
  }
  return (
      <img
        src={handle}
        className={styles.dragHandle}
        alt=""
        onMouseOver={over}
        onMouseLeave={out}
      />
  );
});

const Thumb = (
  { onToggle, onRemove, onDragOver, onInPoint, onOutPoint, onBack, onForward,
    onOver, onOut, onScrub, hidden, frameNumber, id, objectUrl, thumbImageObjectUrl, width, height,
    controlersAreVisible, thumbWidth }
) => {
  // const thumbWidth = 270;
  // let tempObjectUrl = imageDB.thumbList.where({ 'id': id });
  // console.log(imageDB.thumbList.where({ 'id': id }).then(thumb => thumb.id));
  // console.log(`controlersAreVisible: ${controlersAreVisible}`);

  function over(event) {
    event.target.style.opacity = 1;
  }

  function out(event) {
    event.target.style.opacity = 0.5;
  }

  function pad(num, size) {
    let s = num.toString();
    while (s.length < size) s = `0${s}`;
    return s;
  }

  return (
    <div
      onMouseOver={onOver}
      onMouseLeave={onOut}
      className={styles.gridItem}
      style={{
        opacity: hidden ? '0.2' : '1',
        width: thumbWidth,
      }}
    >
      <img
        src={thumbImageObjectUrl || empty}
        // src={tempObjectUrl || empty}
        className={styles.image}
        alt=""
        width={`${thumbWidth}px`}
        height={`${(thumbWidth * (height / width))}px`}
        onClick={onScrub}
      />
      <div
        className={styles.frameNumber}
      >
        {pad(frameNumber, 4)}
      </div>
      <div
        style={{
          display: controlersAreVisible ? 'block' : 'none'
        }}
      >
        <DragHandle />
        <img
          src={hidden ? show : hide}
          className={styles.hide}
          alt=""
          onClick={onToggle}
          onMouseOver={over}
          onMouseLeave={out}
        />
        <img
          src={inPoint}
          className={styles.inPoint}
          alt=""
          onClick={onInPoint}
          onMouseOver={over}
          onMouseLeave={out}
        />
        <img
          src={back}
          className={styles.back}
          alt=""
          onClick={onBack}
          onMouseOver={over}
          onMouseLeave={out}
        />
        {/* <img
          src={scrub}
          className={styles.scrub}
          onClick={onScrub}
          alt=""
          onMouseOver={over}
          onMouseLeave={out}
        /> */}
        <img
          src={forward}
          className={styles.forward}
          alt=""
          onClick={onForward}
          onMouseOver={over}
          onMouseLeave={out}
        />
        <img
          src={outPoint}
          className={styles.outPoint}
          alt=""
          onClick={onOutPoint}
          onMouseOver={over}
          onMouseLeave={out}
        />
      </div>
    </div>
  );
};

Thumb.defaultProps = {
  width: 1920,
  height: 1080
};

Thumb.propTypes = {
  id: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onToggle: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  hidden: PropTypes.bool.isRequired,
  frameNumber: PropTypes.number.isRequired,
  onInPoint: PropTypes.func.isRequired,
  onOutPoint: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onForward: PropTypes.func.isRequired,
  onScrub: PropTypes.func.isRequired,
  onOver: PropTypes.func.isRequired,
  onOut: PropTypes.func.isRequired,
};

export default Thumb;
