export const searchGithub = async () => {
  const response = await fetch('https://api.github.com/search/users?q=type:user');
  const data = await response.json();
  return data.items;
};

export const searchGithubUser = async (username: string) => {
  const response = await fetch(`https://api.github.com/users/${username}`);
  const data = await response.json();
  return data;
};