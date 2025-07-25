# Setup Reference for Future Agents

## Quick Setup Commands
```bash
# Complete setup from scratch
git clone https://github.com/goksnair/resume-builder-ai.git
cd resume-builder-ai
chmod +x setup-unified.sh
./setup-unified.sh --start

# Or step by step
./setup-unified.sh  # Setup only
make start-all      # Start services
```

## Troubleshooting Common Issues

### Backend Issues
- **Import Errors**: Run `pip install -r requirements.txt` in backend venv
- **Port Conflicts**: Check `make status` and kill conflicting processes
- **Database Issues**: Delete SQLite files and restart

### Frontend Issues
- **Node Modules**: Delete `node_modules` and run `npm install`
- **Port Issues**: Vite auto-selects available ports
- **Build Errors**: Check TailwindCSS and PostCSS configurations

### AI Integration Issues
- **Ollama Not Found**: Install Ollama separately if needed
- **Model Loading**: Ensure models are downloaded locally
- **API Timeouts**: Adjust timeout settings in backend config

## Development Workflow
1. Make changes to code
2. Services auto-reload (dev mode)
3. Test with `./test-integration.sh`
4. Check browser at http://localhost:3000+
5. API docs at http://localhost:8000/api/docs

## File Locations to Remember
- Frontend config: `apps/web-app/vite.config.js`
- Backend config: `apps/backend/app/core/config.py`
- Environment vars: `.env` files in each app directory
- Main setup: `setup-unified.sh`
- Testing: `test-integration.sh`
