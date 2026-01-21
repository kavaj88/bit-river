import defineDb from '@astrojs/db';
import { defineTable, column, NOW } from 'astro:db';


const PostViews = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true }),
    slug: column.text({ unique: true }),
    views: column.number({ default: 0 }),
    lastUpdated: column.date({ default: NOW }),
  },
});

export default defineDb({
  tables: { PostViews },
  driver: 'turso',
});
