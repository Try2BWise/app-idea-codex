# SmileSteps POC

SmileSteps is a local-first pediatric dental and orthodontic engagement proof of concept built as a React + Vite PWA.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## GitHub Pages deployment

This project is configured to deploy to GitHub Pages with GitHub Actions.

### What is already set up

- Vite automatically uses the GitHub repository name as the `base` path during the Actions build.
- The workflow file is at `.github/workflows/deploy-pages.yml`.
- The built site artifact comes from `dist/`.

### What you need to do

1. Create a GitHub repository for this project.
2. Push this project to the `main` branch.
3. In GitHub, open `Settings > Pages`.
4. Set `Source` to `GitHub Actions`.
5. Push to `main` again, or run the workflow manually from the `Actions` tab.

After deployment, the site will be available at:

`https://<your-github-username>.github.io/<your-repository-name>/`

## Notes

- The app is currently local-first and stores data in browser local storage.
- Educational content is still a POC mix of placeholder and source-backed family guidance.
