import { useEffect, useState } from 'react';
import { Button, Tag, List, Divider, Typography, Card } from 'antd';
import { useParams, history } from 'umi';

const { Title, Text, Paragraph } = Typography;

interface Post {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  views: number;
}

export default () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [post, setPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const getPosts = (): Post[] =>
    JSON.parse(localStorage.getItem('posts') || '[]');

  const savePosts = (data: Post[]) =>
    localStorage.setItem('posts', JSON.stringify(data));

  useEffect(() => {
    if (!id) return;

    const data = getPosts();

    const updated = data.map(p =>
      String(p.id) === String(id)
        ? { ...p, views: (p.views || 0) + 1 }
        : p,
    );

    savePosts(updated);
    setPosts(updated);

    const found = updated.find(
      p => String(p.id) === String(id),
    );

    setPost(found || null);
  }, [id]);

  if (!post)
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        Not found
      </div>
    );

  const related = posts
    .filter(
      p =>
        p.id !== post.id &&
        p.tags?.some(t => post.tags.includes(t)),
    )
    .slice(0, 5);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: 30,
        background: '#f5f6fa',
        minHeight: '100vh',
      }}
    >
      <div style={{ width: 1000, display: 'flex', gap: 20 }}>
        <Card
          style={{
            flex: 3,
            borderRadius: 12,
            padding: 20,
          }}
        >
          <Button
            onClick={() =>
              history.push(`/TH07-blog/trang-chu`)
            }
            style={{ marginBottom: 20 }}
          >
            ← Quay lại
          </Button>

          <Title level={2}>{post.title}</Title>

          <div style={{ marginBottom: 10 }}>
            <Text type="secondary">
              Admin - {' '}
              {new Date(post.createdAt).toLocaleDateString()} - lượt xem:{' '}
              {post.views}
            </Text>
          </div>

          <div style={{ marginBottom: 20 }}>
            {post.tags?.map(t => (
              <Tag color="blue" key={t}>
                {t}
              </Tag>
            ))}
          </div>

          <Divider />

          <Paragraph
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              whiteSpace: 'pre-line',
            }}
          >
            {post.content}
          </Paragraph>
        </Card>

        <Card
          style={{
            flex: 1,
            borderRadius: 12,
            height: 'fit-content',
          }}
          title="Bài viết liên quan"
        >
          <List
            dataSource={related}
            renderItem={item => (
              <List.Item
                onClick={() =>
                  history.push(
                    `/TH07-blog/trang-chi-tiet/${item.id}`,
                  )
                }
                style={{
                  cursor: 'pointer',
                  padding: '6px 0',
                }}
              >
                <div>
                  <div style={{ fontWeight: 500 }}>
                    {item.title}
                  </div>
                  <div>
                    {item.tags.slice(0, 2).map(t => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
};