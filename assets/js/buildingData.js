/**
 * Building data for the Clôd Cluster Pixel Town
 * Contains information about all buildings including position, size, and descriptive content
 */
import config from './config.js';

const buildingData = {
  // Community Radio Tower - central building
  radioTower: {
    id: 'radio-tower',
    name: 'Community Radio Tower',
    description: 'The central hub of the Clôd Cluster community broadcasting system.',
    position: { x: 0, y: 0, z: 0 },
    dimensions: { width: 8, height: 16, depth: 8 },
    color: 0x4444FF,
    type: 'landmark',
    interactive: true,
    dialogId: 'radio-tower-dialog',
    content: {
      title: 'Community Radio Tower',
      description: `Welcome to the heart of our community! The Radio Tower broadcasts the latest updates, tutorials, and community events throughout the Clôd Cluster.`,
      features: [
        'Live broadcasts of community events',
        'Technical tutorials and discussions',
        'Important network announcements',
        'Developer spotlights and interviews'
      ]
    }
  },
  
  // MCP Development Lab
  mcpLab: {
    id: 'mcp-lab',
    name: 'MCP Development Lab',
    description: 'Where new Model Context Protocols are researched and developed.',
    position: { x: -25, y: 0, z: 15 },
    dimensions: { width: 12, height: 8, depth: 10 },
    color: 0x22AAFF,
    type: 'development',
    interactive: true,
    dialogId: 'mcp-lab-dialog',
    content: {
      title: 'MCP Development Lab',
      description: `The cutting-edge research facility where our developers create and refine new Model Context Protocols.`,
      features: [
        'Protocol testing environments',
        'Collaborative workspaces',
        'Documentation centers',
        'Integration sandboxes'
      ]
    }
  },
  
  // Token Exchange
  tokenExchange: {
    id: 'token-exchange',
    name: 'Token Exchange',
    description: 'The central marketplace for Clôd tokens and protocol access.',
    position: { x: 20, y: 0, z: -15 },
    dimensions: { width: 14, height: 10, depth: 14 },
    color: 0xFFAA22,
    type: 'financial',
    interactive: true,
    dialogId: 'token-exchange-dialog',
    content: {
      title: 'Token Exchange',
      description: `The economic center of our community where developers can exchange tokens for services and protocol access.`,
      features: [
        'Token trading platform',
        'Protocol access marketplace',
        'Developer reward distribution',
        'Contribution valuation system'
      ]
    }
  },
  
  // Developer Hub
  devHub: {
    id: 'dev-hub',
    name: 'Developer Hub',
    description: 'A collaborative space for developers to work together on projects.',
    position: { x: 15, y: 0, z: 25 },
    dimensions: { width: 16, height: 6, depth: 12 },
    color: 0x22CC88,
    type: 'community',
    interactive: true,
    dialogId: 'dev-hub-dialog',
    content: {
      title: 'Developer Hub',
      description: `The community center where developers collaborate, share ideas, and build the future of Clôd Cluster together.`,
      features: [
        'Community forums and discussion areas',
        'Project showcases',
        'Hackathon spaces',
        'Learning resources and guides'
      ]
    }
  },
  
  // Governance Hall
  governanceHall: {
    id: 'governance-hall',
    name: 'Governance Hall',
    description: 'Where community decisions and protocol updates are proposed and voted on.',
    position: { x: -20, y: 0, z: -20 },
    dimensions: { width: 14, height: 12, depth: 14 },
    color: 0xAA44AA,
    type: 'governance',
    interactive: true,
    dialogId: 'governance-hall-dialog',
    content: {
      title: 'Governance Hall',
      description: `The democratic center of our DAO where community members propose, discuss, and vote on important decisions.`,
      features: [
        'Proposal submission system',
        'Voting mechanisms',
        'Community discussion forums',
        'Implementation tracking dashboards'
      ]
    }
  }
};

export default buildingData; 