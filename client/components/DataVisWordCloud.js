/* eslint-disable arrow-parens */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable quote-props */
/* eslint-disable no-var */
/* eslint-disable prefer-template */
/* eslint-disable no-mixed-operators */
/* eslint-disable vars-on-top */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-return-assign */
/* eslint-disable no-console */
/* eslint-disable no-plusplus */
/* eslint-disable no-else-return */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

/**
 * COMPONENT
 */

class DataVisWordCloud extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styles = {
      svg: {
        overflow: "visible",
        marginLeft: "4em",
      },
    };
  }

  componentDidMount() {
    if ((Object.keys(this.props.userWords)).length) {
      this.createBubbles(this.createBubbleStructure(this.props));
    }
  }

  componentWillReceiveProps(nextProps) {
    this.createBubbles(this.createBubbleStructure(nextProps));
  }

  createBubbleStructure(data) {
    let level1Words = [];
    let level2Words = [];
    let level3Words = [];
    let level4Words = [];
    let level5Words = [];
    let level6Words = [];
    let level7Words = [];
    let level8Words = [];
    let level9Words = [];
    let level10Words = [];

    var rootWords = Object.entries(data.userWords);
    rootWords.forEach(function (word) {
      if (word[1].level === 1) {
        level1Words.push({ "name": word[0], "size": word[1].numUsed });
      } else if (word[1].level === 2) {
        level2Words.push({ "name": word[0], "size": word[1].numUsed });
      } else if (word[1].level === 3) {
        level3Words.push({ "name": word[0], "size": word[1].numUsed });
      } else if (word[1].level === 4) {
        level4Words.push({ "name": word[0], "size": word[1].numUsed });
      } else if (word[1].level === 5) {
        level5Words.push({ "name": word[0], "size": word[1].numUsed });
      } else if (word[1].level === 6) {
        level6Words.push({ "name": word[0], "size": word[1].numUsed });
      } else if (word[1].level === 7) {
        level7Words.push({ "name": word[0], "size": word[1].numUsed });
      } else if (word[1].level === 8) {
        level8Words.push({ "name": word[0], "size": word[1].numUsed });
      } else if (word[1].level === 9) {
        level9Words.push({ "name": word[0], "size": word[1].numUsed });
      } else if (word[1].level === 10) {
        level10Words.push({ "name": word[0], "size": word[1].numUsed });
      }
    });

    const childrenWords = [];
    if (!level1Words.length) level1Words = [{ "name": "You have not used any words from level 1 yet!", "size": 10 }];
    if (!level2Words.length) level2Words = [{ "name": "You have not used any words from level 2 yet!", "size": 10 }];
    if (!level3Words.length) level3Words = [{ "name": "You have not used any words from level 3 yet!", "size": 10 }];
    if (!level4Words.length) level4Words = [{ "name": "You have not used any words from level 4 yet!", "size": 10 }];
    if (!level5Words.length) level5Words = [{ "name": "You have not used any words from level 5 yet!", "size": 10 }];
    if (!level6Words.length) level6Words = [{ "name": "You have not used any words from level 6 yet!", "size": 10 }];
    if (!level7Words.length) level7Words = [{ "name": "You have not used any words from level 7 yet!", "size": 10 }];
    if (!level8Words.length) level8Words = [{ "name": "You have not used any words from level 8 yet!", "size": 10 }];
    if (!level9Words.length) level9Words = [{ "name": "You have not used any words from level 9 yet!", "size": 10 }];
    if (!level10Words.length) level10Words = [{ "name": "You have not used any words from level 10 yet!", "size": 10 }];
    childrenWords.push({ "name": "Level 1", "children": level1Words }, { "name": "Level 2", "children": level2Words }, { "name": "Level 3", "children": level3Words }, { "name": "Level 4", "children": level4Words }, { "name": "Level 5", "children": level5Words }, { "name": "Level 6", "children": level6Words }, { "name": "Level 7", "children": level7Words }, { "name": "Level 8", "children": level8Words }, { "name": "Level 9", "children": level9Words }, { "name": "Level 10", "children": level10Words });

    const root = {
        "name": "wordCloud",
        "children": childrenWords,
    };

    return root;
  }

  createBubbles(rootParam) {
    var svg = d3.select(this.svgRoot),
      margin = 20,
      diameter = +svg.attr("width"),
      g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

    var color = d3.scaleLinear()
      .domain([-1, 2])
      .range(["hsl(0, 0%, 91%)", "hsl(259, 100%, 20%)"])
      .interpolate(d3.interpolateHcl);

    var pack = d3.pack()
      .size([diameter - margin, diameter - margin])
      .padding(2);

    var root = rootParam || {
      "name": "wordCloud",
      "children": [
        {
          "name": "Level 1",
          "size": 100,
        },
        {
          "name": "Level 2",
          "size": 100,
        },
        {
          "name": "Level 3",
          "size": 100,
        },
        {
          "name": "Level 4",
          "size": 100,
        },
        {
          "name": "Level 5",
          "size": 100,
        },
        {
          "name": "Level 6",
          "size": 100,
        },
        {
          "name": "Level 7",
          "size": 100,
        },
        {
          "name": "Level 8",
          "size": 100,
        },
        {
          "name": "Level 9",
          "size": 100,
        },
        {
          "name": "Level 10",
          "size": 100,
        },
      ],
    };

    root = d3.hierarchy(root)
      .sum(function (d) { return d.size; })
      .sort(function (a, b) { return b.value - a.value; });

    var focus = root,
      nodes = pack(root).descendants(),
      view;

    var circle = g.selectAll("circle")
      .data(nodes)
      .enter().append("circle")
      .attr("class", function (d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
      .style("fill", function (d) { return d.children ? color(d.depth) : null; })
      .on("click", function (d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });

    var text = g.selectAll("text")
      .data(nodes)
      .enter().append("text")
      .attr("class", "label")
      .style("fill-opacity", function (d) { return d.parent === root ? 1 : 0; })
      .style("display", function (d) { return d.parent === root ? "inline" : "none"; })
      .text(function (d) { return d.data.name; });

    var node = g.selectAll("circle,text");

    svg
      .style("background", color(-1))
      .on("click", function () { zoom(root); });

    zoomTo([root.x, root.y, root.r * 2 + margin]);

    function zoom(d) {
      var focus0 = focus; focus = d;

      var transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function (d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
          return function (t) { zoomTo(i(t)); };
        });

      transition.selectAll("text")
        .filter(function (d) { return d.parent === focus || this.style.display === "inline"; })
        .style("fill-opacity", function (d) { return d.parent === focus ? 1 : 0; })
        .on("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });
    }

    function zoomTo(v) {
      var k = diameter / v[2]; view = v;
      node.attr("transform", function (d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
      circle.attr("r", function (d) { return d.r * k; });
    }
  }

  render() {
    return (
        <svg
          width="890"
          height="890"
          style={this.styles.svg}
          ref={svg => this.svgRoot = svg}
        />
    );
  }
}

/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    userWords: state.userWords,
  };
};

const mapDispatch = (dispatch) => {
  return {};
};

export default withRouter(connect(mapState, mapDispatch)(DataVisWordCloud));

/**
 * PROP TYPES
 */
DataVisWordCloud.propTypes = {
  userWords: PropTypes.object.isRequired,
};