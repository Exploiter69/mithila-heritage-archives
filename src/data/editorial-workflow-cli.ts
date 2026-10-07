import { getEditorialQueue } from "./editorial-workflow";

const queue = getEditorialQueue();
console.log(\`Editorial queue: \${queue.length} items\`);
for (const item of queue) {
  console.log(\`[\${item.priority.toUpperCase()}] \${item.kind} — \${item.slug}: \${item.reason}\`);
}
