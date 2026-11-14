export const siteConfig = {
  name: "OneStream Docs",
  shortName: "OneStream",
  description:
    "Documentação moderna sincronizada diretamente com os arquivos Markdown da branch main no GitHub.",
  githubRepo:
    process.env.NEXT_PUBLIC_GITHUB_REPO || "seu-usuario/OneStream",
  githubBranch: process.env.NEXT_PUBLIC_GITHUB_BRANCH || "main",
  docsFolder: "docs",
  getGithubFileUrl(relativePath: string) {
    return `https://github.com/${this.githubRepo}/blob/${this.githubBranch}/${this.docsFolder}/${relativePath}`;
  },
  getGithubRepoUrl() {
    return `https://github.com/${this.githubRepo}`;
  },
};
