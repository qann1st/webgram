export const secondInClocks = (time: number) => {
  const hours = Math.floor(time / 60 / 60);
  const minutes = Math.floor(time / 60) - hours * 60;
  const seconds = time % 60;
  return { hours, minutes, seconds };
};
