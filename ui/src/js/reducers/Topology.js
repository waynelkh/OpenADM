import Immutable from 'seamless-immutable';
import Topo from '../components/Topology/Topo.js';

const initalState = Immutable.from({
  nodes: [],
  links: [],
  fixedNode: {},
  level: 0,
  filter: [],
  selectNodes: [],
  tag: '',
});

export default (state = initalState, { type, payload }) => {
  switch (type) {
    // case 'SEARCH_NODE':
    //   return state.set('searchNode', payload);
    // case 'TAG_CHANGE':
    //   return state.set('tag', payload);
    // case 'LEVEL_CHANGE':
    //   return state.set('level', payload);

    case 'DRAG_NODE':
      return state.update('fixedNode', d => d.merge(payload));
    case 'RELEASE_NODE':
      return state.set('fixedNode', {});

    case 'UPDATE_GROUP': {
      Topo.updateGroup();
      return state;
    }

    case 'CLICK_NODE':
      return state;

    case 'CLICK_LINK':
      console.info('CLICK_LINK: ', payload);
      return state;

    case 'SELECT_NODE':
      return state.update('selectNodes', nodes => {
        const ni = nodes.findIndex(n => n.uid === payload.uid);
        return (ni !== -1) ?
          nodes.slice(0, ni).concat(nodes.slice(ni + 1, nodes.length)) :
          nodes.concat(payload);
      });
    /**
     * { ip, vlan, mac, controller, type, location }
     * location: { port, dpid }
     */
    case 'ADDHOST': {
      const uid = `${payload.controller}@${payload.mac}`;
      const host = (state.fixedNode[uid]) ?
          { ...payload, uid, ...state.fixedNode[uid], fixed: true } :
          { ...payload, uid };

      Topo.addNodeToSet({
        ...host,
      });
      const suid = `${payload.controller}@${payload.location.dpid}`;
      Topo.addLinkById(suid, uid, 's2h');
      // Topo.updateGroup();
      return state;
    }
    /**
     * { controller, mac }
     */
    case 'DELHOST': {
      Topo.delNode({
        ...payload,
        uid: `${payload.controller}@${payload.mac}`,
      });
      return state;
    }
    /**
     * { controller, type, dpid }
     * {controller: "waynesdn", type: "switch", dpid: "00:00:00:00:00:00:00:03"}
     */
    case 'ADDDEVICE': {
      const uid = `${payload.controller}@${payload.dpid}`;
      const node = (state.fixedNode[uid]) ?
        { ...payload, uid, ...state.fixedNode[uid], fixed: true } :
        { ...payload, uid };

      Topo.addNodeToSet(node);
      setTimeout(() => {
        Topo.verticalNode();
      }, 500);
      return state;
    }
    /**
     * { controller, dpid }
     */
    case 'DELDEVICE': {
      Topo.delNode({
        ...payload,
        uid: `${payload.controller}@${payload.dpid}`,
      });
      return state;
    }
    /**
     * { controller, link: [{dpid, port},{dpid, port}]}
     */
    case 'ADDLINK': {
      setTimeout(() => {
      Topo.addLinkById(
        `${payload.controller}@${payload.link[0].dpid}`,
        `${payload.controller}@${payload.link[1].dpid}`,
        's2s'
      );
      }, 500);
      return state;
    }
    /**
     * { controller, link: [{dpid, port},{dpid, port}] }
     */
    case 'DELLINK': {
      const ulink = payload.link.map(l => ({
        ...l,
        uid: `${payload.controller}@${l.dpid}`,
      }));
      Topo.delLinkById({
        ...payload,
        link: ulink,
      });
      return state;
    }
    /**
     * { controller, adddevice, addlink, addhost, addport }
     */
    case 'ALL_DATA': {
      const { devices, links, hosts, ports, controllers } = payload;

      const topoNodes = devices.map(d => {
        const uid = `${d.controller}@${d.dpid}`;
        return (state.fixedNode[uid]) ?
          { ...d, uid, ...state.fixedNode[uid], fixed: true } :
          { ...d, uid };
      }).concat(hosts.map(d => {
        const uid = `${d.controller}@${d.mac}`;
        return (state.fixedNode[uid]) ?
          { ...d, uid, ...state.fixedNode[uid], fixed: true } :
          { ...d, uid };
      }));
      const topolinks = links.map(l => ({
        source: `${l.controller}@${l.link[0].dpid}`,
        target: `${l.controller}@${l.link[1].dpid}`,
        linkType: 's2s',
        controller: l.controller,
        ...l,
      })).concat(
        hosts.map(h => ({
          source: `${h.controller}@${h.location.dpid}`,
          target: `${h.controller}@${h.mac}`,
          linkType: 's2h',
          controller: h.controller,
        }))
      );
      const topoNodeSet = controllers.map(c => ({
        controller: c.controller,
        nodes: topoNodes
          .filter(d => d.controller === c.controller)
          .map(d => d.uid),
      })).filter(d => d.controller !== 'gateway');
	console.log('TopoNodeSet: ', topoNodeSet);
      const topoData = {
        nodes: topoNodes,
        links: topolinks,
        nodeSet: topoNodeSet,
      };
      Topo.setData(topoData);
      setTimeout(() => {
        Topo.verticalNode();
      }, 500);
      return state;
    }
    /**
     * { controller, mac_src, mac_dst , port_src, port_dst, ip_src, ip_dst
     * 	 protocol, ther_type, in_port, dpid }
     */
    case 'PACKET': {
      return state;
    }
    case 'VERTICAL_NODE': {
      Topo.verticalNode();
      return state;
    }
    case 'CLEAR_ALL_PATH': {
      Topo.clearAllPath();
      return state;
    }
    case 'SIMULATE_RESP': {
      Topo.addPath(payload);
      return state;
    }
    case 'LINKINFOUPDATE': {
      Topo.linkInfoUpdate(payload);
      return state;
    }
    default:
      return state;
  }
};
