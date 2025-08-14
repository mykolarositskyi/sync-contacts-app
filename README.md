# Contact Sync Hub 🔄

A powerful contact management platform that seamlessly synchronizes your contacts across multiple CRM systems with real-time bidirectional synchronization.

[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Features

- **🔄 Real-time Sync**: Bidirectional synchronization between multiple CRM platforms
- **📱 Modern UI**: Beautiful, responsive interface built with Tailwind CSS and Shadcn UI
- **🔌 Multi-Platform Support**: HubSpot, Pipedrive, and more CRM integrations
- **🔐 Secure Authentication**: JWT-based authentication with customer isolation
- **📊 Contact Management**: Full CRUD operations with advanced filtering and search
- **🌐 Webhook Integration**: Real-time updates via webhooks from external platforms
- **📈 Performance Optimized**: Built with Next.js 15 and React 19 for optimal performance

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB database
- Integration.app account and API credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd contact-sync-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   INTEGRATION_APP_WORKSPACE_KEY=your_workspace_key
   INTEGRATION_APP_WORKSPACE_SECRET=your_workspace_secret
   INTEGRATION_APP_WEBHOOK_API_KEY=your_webhook_api_key
   INTEGRATION_APP_WEBHOOK_URL=your_webhook_url
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

Contact Sync Hub is built with a modern, scalable architecture:

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS with Shadcn UI components
- **Backend**: Next.js API routes with MongoDB integration
- **Authentication**: JWT-based auth with customer isolation
- **Data Sync**: Integration.app SDK for CRM platform connections
- **Real-time Updates**: Webhook-based synchronization

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode

## 📱 Screenshots

*Add screenshots of your application here*

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📚 Documentation

- [Developer Guide](dev.md) - Comprehensive technical documentation
- [API Reference](docs/api.md) - API endpoint documentation
- [Integration Guide](docs/integrations.md) - CRM platform integration details

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Self-hosted servers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@contactsynchub.com
- 💬 Discord: [Join our community](https://discord.gg/contactsynchub)
- 📖 Documentation: [docs.contactsynchub.com](https://docs.contactsynchub.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/contact-sync-hub/issues)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com/) for the beautiful component library
- [Integration.app](https://integration.app/) for the CRM integration platform
- [MongoDB](https://www.mongodb.com/) for the database solution

---

**Made with ❤️ by the Contact Sync Hub team**