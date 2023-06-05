export const countLike = (currentStatus: string, newStatus: string,
                          likes: number, dislikes: number) => {

  if (currentStatus === "None") {
    if (newStatus === "Like") likes += 1;
    if (newStatus === "Dislike") dislikes += 1;
  }

  if (currentStatus === "Like") {
    if (newStatus === "None") likes -= 1;
    if (newStatus === "Dislike") {
      likes -= 1;
      dislikes += 1;
    }
  }

  if (currentStatus === "Dislike") {
    if (newStatus === "None") dislikes -= 1;
    if (newStatus === "Like") {
      likes += 1;
      dislikes -= 1;
    }
  }

  return { likes, dislikes };
};