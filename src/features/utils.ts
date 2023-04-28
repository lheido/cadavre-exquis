export const getPeerId = (id: string): string => `cadavre-exquis-${id}`;

export const removePeerIdPrefix = (id: string): string =>
  id.replace("cadavre-exquis-", "");
