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
  
  // MCP Development Lab (Shop-Looking Building)
  mcpLab: {
    id: 'mcp-lab',
    name: 'MCP Development Lab',
    description: 'WE GAMIFIED CODING.\n\nThe tools are validated by usage. You earn $CLAUD$ every time you use a minted MCP. Total $CLAUD$ earned by everyone ranks the MCP tools. Knowing what tools are the best is as easy as using your favorites.',
    position: { x: 30, y: 0, z: 0 },
    dimensions: { width: 12, height: 8, depth: 10 },
    color: 0x22AAFF,
    type: 'development',
    interactive: true,
    dialogId: 'mcp-lab-dialog',
    content: {
      title: 'MCP Development Lab',
      description: `WE GAMIFIED CODING.\n\nThe tools are validated by usage. You earn $CLAUD$ every time you use a minted MCP. Total $CLAUD$ earned by everyone ranks the MCP tools. Knowing what tools are the best is as easy as using your favorites.`,
      features: [
        'Protocol testing environments',
        'Collaborative workspaces',
        'Documentation centers',
        'Integration sandboxes'
      ]
    }
  },
  
  // Token Exchange (Gym-Looking Building)
  tokenExchange: {
    id: 'token-exchange',
    name: 'Token Exchange',
    description: "IT'S GAMIFIED SOCIAL MEDIA.\n\nYou reply to a post, you share knowledge, you earn $CLAUD$. This self-sustaining community automates curation of development resources and fosters a helpful environment.",
    position: { x: 0, y: 0, z: 30 },
    dimensions: { width: 14, height: 10, depth: 14 },
    color: 0xFFAA22,
    type: 'financial',
    interactive: true,
    dialogId: 'token-exchange-dialog',
    content: {
      title: 'Token Exchange',
      description: `IT'S GAMIFIED SOCIAL MEDIA.\n\nYou reply to a post, you share knowledge, you earn $CLAUD$. This self-sustaining community automates curation of development resources and fosters a helpful environment.`,
      features: [
        'Token trading platform',
        'Protocol access marketplace',
        'Developer reward distribution',
        'Contribution valuation system'
      ]
    }
  },
  
  // Developer Hub (Home with AI IDE)
  devHub: {
    id: 'dev-hub',
    name: 'Developer Hub',
    description: "GET PAID FOR YOUR DATA.\n\nContribute code or share what you're building. Earn $CLAUD$ for valuable posts. Decentralized community means you keep the revenue; your content grows the ecosystem.",
    position: { x: -30, y: 0, z: 0 },
    dimensions: { width: 16, height: 6, depth: 12 },
    color: 0x22CC88,
    type: 'community',
    interactive: true,
    dialogId: 'dev-hub-dialog',
    content: {
      title: 'Developer Hub',
      description: `GET PAID FOR YOUR DATA.\n\nContribute code or share what you're building. Earn $CLAUD$ for valuable posts. Decentralized community means you keep the revenue; your content grows the ecosystem.`,
      features: [
        'Community forums and discussion areas',
        'Project showcases',
        'Hackathon spaces',
        'Learning resources and guides'
      ]
    }
  },
  
  // Apartment Building
  apartmentBuilding: {
    id: 'apartment',
    name: 'Taller Multi-Story Apartment',
    description: "ZERO MARKETING IN OUR CONTENT FEED.\n\nYou earn $CLAUD$ for watching tutorials and reading posts. Tokenization identifies the signal from the noise based on genuine community behavior. No brand can hijack your feed.",
    position: { x: 0, y: 0, z: -30 },
    dimensions: { width: 14, height: 12, depth: 14 },
    color: 0x9E9EB4,
    type: 'apartment',
    interactive: true,
    dialogId: 'apartment-dialog',
    content: {
      title: 'Apartment Building',
      description: `ZERO MARKETING IN OUR CONTENT FEED.\n\nYou earn $CLAUD$ for watching tutorials and reading posts. Tokenization identifies the signal from the noise based on genuine community behavior. No brand can hijack your feed.`,
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