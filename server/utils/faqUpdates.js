const subscribers = new Set();

export const publishFaqUpdate = () => {
  for (const response of subscribers) response.write('event: changed\ndata: {}\n\n');
};

export const subscribeFaqUpdates = (req, res) => {
  res.set({ 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', 'X-Accel-Buffering': 'no' });
  res.flushHeaders();
  subscribers.add(res);
  res.write('event: changed\ndata: {}\n\n');
  const timer = setInterval(() => res.write(': keepalive\n\n'), 25000);
  timer.unref?.();
  res.on('close', () => { clearInterval(timer); subscribers.delete(res); });
};
