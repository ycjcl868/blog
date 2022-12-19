const buildJsDelivrLink = (user, repo, version, path) => {
  if (version === 'latest') {
    return `https://cdn.jsdelivr.net/gh/${user}/${repo}/${path}`
  }

  return `https://cdn.jsdelivr.net/gh/${user}/${repo}@${version}/${path}`
}

export const gitHub2jsDelivr = (gitHub: string) => {
  const pattern =
    /^https?:\/\/(?:github|raw\.githubusercontent)\.com\/([^/]+)\/([^/]+)(?:\/blob)?\/([^/]+)\/(.*)$/i
  const match = pattern.exec(gitHub)

  if (match) {
    const [, user, repo, version, file] = match

    return buildJsDelivrLink(user, repo, version, file)
  }

  return gitHub
}
