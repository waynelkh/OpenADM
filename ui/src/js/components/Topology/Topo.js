/* eslint-disable no-underscore-dangle,  */
import { scaleOrdinal, schemeCategory10 } from 'd3';
import Helper from '../../utils/TopoHelper';
import { keyMap } from '../../constant/moduleMapping';
import _ from 'lodash';

const nx = global.nx;
const color10 = scaleOrdinal(schemeCategory10);
// save controller to choose color
let clist = [];
const getColorWithController = cname => color10(clist.indexOf(cname));

let topoInstant;
var Line = nx.geometry.Line;
var Vector = nx.geometry.Vector;
nx.define('MyExtendLink', nx.graphic.Topology.Link, {
  properties: {
    sourcelabel: null,
    targetlabel: null
  },
  view: function(view) {
      view.content.push({
          name: 'source',
          type: 'nx.graphic.Text',
          props: {
              'class': 'sourcelabel',
              'alignment-baseline': 'text-after-edge',
              'text-anchor': 'start'
          }
      }, {
          name: 'target',
          type: 'nx.graphic.Text',
          props: {
              'class': 'targetlabel',
              'alignment-baseline': 'text-after-edge',
              'text-anchor': 'end'
          }
      });

      return view;
  },
  methods: {
    update: function () {
      var _offset = this.getOffset();
      var offset = new Vector(0, _offset);
      var stageScale = this.stageScale();
      var width = (this._width || 1) * (this._stageScale || 1);
      var line = this.reverse() ? this.line().negate() : this.line();

      var lineEl = this.view('line');
      var pathEL = this.view('path');
      var newLine = line.translate(offset).pad(22 * stageScale, 32 * stageScale);
      lineEl.sets({
          x1: newLine.start.x,
          y1: newLine.start.y,
          x2: newLine.end.x,
          y2: newLine.end.y
      });
      pathEL.setStyle('display', 'none');
      lineEl.setStyle('display', 'block');
      lineEl.setStyle('stroke-width', width);
      lineEl.setStyle('marker-end', 'url(#markerArrow)');

      var el, point;
      var angle = line.angle();
      // pad line
      line = line.pad(18 * stageScale, 18 * stageScale);
      if (this.model().getData().label) {
        el = this.view('source');
        point = line.start;
        el.set('x', point.x);
        el.set('y', point.y);
        el.set('text', this.model().getData().label.src.value );
        el.set('transform', `rotate(${angle} ${point.x},${point.y})`);
        el.setStyle('font-size', 12 * stageScale);

        el = this.view('target');
        point = line.end;
        el.set('x', point.x);
        el.set('y', point.y);
        el.set('text', this.model().getData().label.dst.value );
        el.set('transform', `rotate(${angle} ${point.x},${point.y})`);
        el.setStyle('font-size', 12 * stageScale);
      }
    }
  }
});

class Topo {
  initalTopo(renderDom) {
    topoInstant = new nx.graphic.Topology({
      // style: {
      //   'background-color': '#EEEEEE',
      // },
      adaptive: true,
      scalable: true,
      showIcon: true,
      enableSmartLabel: true,
      enableSmartNode: true,
      enableGradualScaling: true,
      supportMultipleLink: true,
      identityKey: 'uid',
      autoLayout: true,
      dataProcessor: 'nextforce',
      // layoutType: 'hierarchicalLayout',
      // nodeInstanceClass: 'ExtendedNode',
      linkInstanceClass: 'MyExtendLink',
      nodeConfig: {
        iconType: vertex => vertex.get('nodeType'),
        label: vertex => Helper.nodeSwitcher(vertex).label,
        color: vertex => getColorWithController(vertex.get('controller')),
      },
      linkConfig: {
        width: vertex => (vertex.getData().width) ? vertex.getData().width.value * 2 : 2,
        linkType: 'parallel',
        style: vertex => {
          return (vertex.get('linkType') !== 's2s') ? { 'stroke-dasharray': '1 , 1' } : {};
        },
        color: vertex => getColorWithController(vertex._sourceID.split('@')[0]),
      },
      nodeSetConfig: {
        iconType: 'cloud',
        label: 'model.controller',
        color: vertex => getColorWithController(vertex.get('controller')),
      },
      vertexPositionGetter() {
        // if this is node, use original position
        if (this.type() === 'vertex') {
          return {
            x: nx.path(this._data, 'x') || 0,
            y: nx.path(this._data, 'y') || 0,
          };
        }
        // if this is a nodeSet, use the firNode's position
        const graph = this.graph();
        const firstVertex = graph.getVertex(this.get('nodes').slice(0).shift());

        if (firstVertex) {
          return firstVertex.position();
        }
        return {
          x: Math.random() * 500,
          y: Math.random() * 500,
        };
      },
      vertexPositionSetter(position) {
        if (this._data) {
          const x = nx.path(this._data, 'x');
          const y = nx.path(this._data, 'y');
          if (position.x !== x || position.y !== y) {
            nx.path(this._data, 'x', position.x);
            nx.path(this._data, 'y', position.y);
            return true;
          }
          return false;
        }
        return false;
      },
      // layoutType: 'WorldMap',
      // layoutConfig: {
      //   longitude: 'model.longitude',
      //   latitude: 'model.latitude',
      //   worldTopoJson: 'js/world.js',
      // },
      // tooltipManagerConfig: {
      //   nodeTooltipContentClass: 'MyNodeTooltip'
      // },
    });

    topoInstant.on('topologyGenerated', (sender, event) => {
      topoInstant.adaptToContainer();
      topoInstant.expandAll();
      topoInstant.tooltipManager().showNodeTooltip(false);
      // topoInstant.tooltipManager().showLinkTooltip(false);
    });

    // topoInstant.on('addNode', (sender, event) => {
    //   topoInstant.fit();
    // });
    const app = new nx.ui.Application();
    app.on('resize', () => {
      topoInstant.adaptToContainer();
    });
    app.container(renderDom);
    topoInstant.attach(app);
    window.topo = topoInstant;
  }

  bindEvent(props) {
    topoInstant.on('clickNode', (topo, node) => {
      // props.clickNode(node.model().getData());
    });
    topoInstant.on('clickLink', (topo, link) => {
      console.log('clickLink: ', link);
      props.clickLink(link.model().getData());
    });
    topoInstant.on('selectNode', (topo, nodes) => {
      props.selectNode(nodes.model().getData());
    });

    topoInstant.on('dragNodeEnd', (topo, target) => {
      props.dragNode({
        [target.id()]: target.position(),
      });
    });
    const pathLayer = topoInstant.getLayer('paths');
    pathLayer.ondragend = (d, a) => {
      console.log('path dragend', d, a);
    };
    topoInstant.on('keypress', (topo, e) => {
      switch (e.key) {
        case 'c':
          props.toggleModule(keyMap[e.key]);
          break;
        case 'f':
          props.toggleModule(keyMap[e.key]);
          break;
        case 's':
          props.toggleModule(keyMap[e.key]);
          break;
        case 'p':
          props.toggleModule(keyMap[e.key]);
          break;
        case 'd':
          props.toggleModule(keyMap[e.key]);
          break;
        case 'r':
          props.resetLayout();
          break;
        case 'v':
          this.verticalNode();
          break;
        case 'b':
          topoInstant.collapseAll();
          break;
        case '?':
          props.toggleModule(keyMap[e.key]);
          break;
        default:
          return;
      }
    });
  }

  setData(data) {
    clist = _.uniq(['physical']
	.concat(data.nodeSet.map(d => d.controller))).filter(n => n !== 'gateway');
    topoInstant.data(data);
    topoInstant.expandAll();
  }

  insertData(data) {
    const newNodes = data.nodes.map(d => ({
      ...d,
      x: Math.random() * 200,
      y: Math.random() * 200,
    }));

    topoInstant.insertData({
      ...data,
      nodes: newNodes,
    });
  }

  addNode(data) {
    if (!Array.isArray(data) && !data.x) {
      topoInstant.addNode({
        ...data,
        x: Math.random() * 200,
        y: Math.random() * 200,
      });
    } else {
      topoInstant.addNode(data);
    }
  }

  delNode({ uid }) {
    topoInstant.removeNode(uid);
  }

  updateGroup() {
    const groupNode = _.groupBy(topoInstant.getNodes(), node => node.model().getData().controller);
    console.info('Group node:', groupNode);
    const groupLayer = topoInstant.getLayer('groups');
    groupLayer.clear();
    Object.keys(groupNode).forEach(name => {
      groupLayer.addGroup({
        nodes: groupNode[name],
        label: name,
        shapeType: 'nodeSetPolygon',
        color: getColorWithController(name),
      });
    });
  }

  addNodeToSet(nodeData) {
    const nodeSet = topoInstant.getLayer('nodeSet')
      .nodeSets().filter(n => n.label() === nodeData.controller)[0];
    const graph = topoInstant.graph();
    if (nodeSet !== []) {
      const vertexSet = nodeSet.model();
      const vertex = graph._addVertex({
        x: Math.random() * 200,
        y: Math.random() * 200,
        ...nodeData,
      });
      vertexSet.addVertex(vertex);
      graph.updateVertexSet(vertex);
      if (!nodeSet.collapsed()) {
        const animation = nodeSet.animation();
        nodeSet.animation(false);
        nodeSet.collapsed(true);
        nodeSet.collapsed(false);
        nodeSet.animation(animation);
      }
    }
  }

  addLinkById(source, target, linkType) {
    topoInstant.addLink({ source, target, linkType });
  }

  delLinkById({ link }) {
    const linkIds = this.getLinksByNodeUid(link[0].uid, link[1].uid);

    linkIds.forEach(linkId => {
      topoInstant.deleteLink(linkId);
    });
  }

  linkInfoUpdate(linkInfo) {
    console.log('linkInfoUpdate: ', linkInfo);
    const linkIds = this.getLinksByNodeUid(
      `${linkInfo.controller}@${linkInfo.link[0].dpid || link[0].mac}`,
      `${linkInfo.controller}@${linkInfo.link[1].dpid || link[1].mac}`
    );
    const linkClass = topoInstant.getLink(linkIds[0]);
    const content = {
      rate: JSON.stringify(linkInfo.label),
      label: linkInfo.label,
      traffic: linkInfo.width.value,
    }
    linkClass.model().sets(content);
    linkClass.width(linkInfo.width.value * 2);

    console.log('linkIds and value:', linkIds, linkInfo.width.value);
  }

  addPath(linkCollection = {}) {
    console.log('Add path: ', linkCollection);
    if (linkCollection.path && !linkCollection.path.length) {
      return;
    }
    if (linkCollection.length === 0) {
      return;
    }
    const pathLayer = topoInstant.getLayer('paths');
    const links = linkCollection.path.map(link => {
      const linkIds = this.getLinksByNodeUid(
        `${linkCollection.controller}@${link[0].dpid || link[0].mac}`,
        `${linkCollection.controller}@${link[1].dpid || link[1].mac}`
      );
      return topoInstant.getLink(linkIds[0]);
    });

    const path1 = new nx.graphic.Topology.Path({
      links,
      arrow: 'end',
    });
    pathLayer.addPath(path1);
  }

  clearAllPath() {
    const pathLayer = topoInstant.getLayer('paths');
    pathLayer.clear();
  }
  /**
   * [getLinksByNodeUid description]
   * @param  {[type]} sourceId   [description]
   * @param  {[type]} targetId   [description]
   * @param  {[type]} controller [description]
   * @return {[type]}            [description]
   */
  getLinksByNodeUid(sourceUid, targetUid) {
    const linkClasses = topoInstant.getLinksByNode(sourceUid, targetUid);
    return Object.keys(linkClasses);
  }

  verticalNode() {
    topoInstant.getNodes().forEach(node => {
      if(node.model().getData().controller !== 'physical'){
        const dpid = node.model().getData().dpid;
        const physicalNode = topoInstant.getNode(`physical@${dpid}`);
        if (physicalNode) {
          const LEVEL = (clist.indexOf(node.model().getData().controller)) * 300;
          node.y(physicalNode.y() - LEVEL);
          node.x(physicalNode.x());
        }
        else if(node.model().getData().mac){
          const mac = node.model().getData().mac;
          const LEVEL = (clist.indexOf(node.model().getData().controller)) * 300;
          const physicalHost = topoInstant.getNode(`physical@${mac}`);
          if(physicalHost) {
            node.y(physicalHost.y() - LEVEL);
            node.x(physicalHost.x());
          }
        }
      }
    })
  }

  changeNodeLable(id, label) {
    topoInstant.getNode(id).label(label);
  }

  getTopo() {
    return topoInstant;
  }
}

const topology = new Topo();
export default topology;
/* eslint-enable no-underscore-dangle,  */
