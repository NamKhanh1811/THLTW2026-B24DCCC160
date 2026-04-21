import { useEffect, useState } from 'react';
import { Card, List, Tag, Input, Pagination } from 'antd';
import { history } from 'umi';
import { debounce } from 'lodash';

const { Meta } = Card;

interface Post {
  id: string;
  title: string;
  content: string;
  summary: string;
  thumbnail: string;
  tags: string[];
  status: 'draft' | 'published';
  createdAt: string;
  views: number;
}

export default () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filtered, setFiltered] = useState<Post[]>([]);
  const [keyword, setKeyword] = useState('');
  const [tag, setTag] = useState('');
  const [page, setPage] = useState(1);

  const getPosts = (): Post[] =>
    JSON.parse(localStorage.getItem('posts') || '[]');

  useEffect(() => {
    const data = getPosts().filter(p => p.status === 'published');
    setPosts(data);
    setFiltered(data);
  }, []);

  useEffect(() => {
    let data = [...posts];

    if (keyword) {
      data = data.filter(p =>
        p.title.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (tag) {
      data = data.filter(p => p.tags.includes(tag));
    }

    setFiltered(data);
  }, [keyword, tag, posts]);

  const handleSearch = debounce((val: string) => {
    setKeyword(val);
  }, 300);

  const pageSize = 9;
  const dataShow = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <h1>Blog</h1>

      <Input
        placeholder="Search..."
        onChange={e => handleSearch(e.target.value)}
      />

      <div style={{ margin: 10 }}>
        {[...new Set(posts.flatMap(p => p.tags))].map(t => (
          <Tag key={t} onClick={() => setTag(t)}>
            {t}
          </Tag>
        ))}
      </div>

      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={dataShow}
        renderItem={item => (
          <List.Item>
            <Card
              hoverable
              cover={<img src={item.thumbnail} height={150} />}
              onClick={() => history.push(`/TH07-blog/trang-chi-tiet/${item.id}`)}
            >
              <Meta title={item.title} description={item.summary} />
              <div>
                {item.tags.map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </Card>
          </List.Item>
        )}
      />

      <Pagination
        current={page}
        total={filtered.length}
        pageSize={pageSize}
        onChange={setPage}
      />
    </div>
  );
};