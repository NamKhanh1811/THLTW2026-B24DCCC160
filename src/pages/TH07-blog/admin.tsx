import { useEffect, useState } from 'react';
import {Table, Button, Modal, Form, Input, Select, Popconfirm, Tag, List } from 'antd';

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  thumbnail: string;
  tags: string[];
  status: 'draft' | 'published';
  createdAt: string;
  views: number;
}

interface TagItem {
  id: string;
  name: string;
}

export default () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filtered, setFiltered] = useState<Post[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const [tags, setTags] = useState<TagItem[]>([]);
  const [tagModal, setTagModal] = useState(false);
  const [tagForm] = Form.useForm();

  const getPosts = (): Post[] =>
    JSON.parse(localStorage.getItem('posts') || '[]');

  const savePosts = (data: Post[]) =>
    localStorage.setItem('posts', JSON.stringify(data));

  const getTags = (): TagItem[] =>
    JSON.parse(localStorage.getItem('tags') || '[]');

  const saveTags = (data: TagItem[]) =>
    localStorage.setItem('tags', JSON.stringify(data));

  

  useEffect(() => {
    setPosts(getPosts());
    setTags(getTags());
  }, []);


  useEffect(() => {
    let data = [...posts];

    if (search) {
      data = data.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (status) {
      data = data.filter(p => p.status === status);
    }

    setFiltered(data);
  }, [search, status, posts]);

  const onSubmitPost = (values: any) => {
    let newPosts = [...posts];

    if (values.id) {
      newPosts = newPosts.map(p =>
        p.id === values.id ? { ...p, ...values } : p,
      );
    } else {
      newPosts.push({
        ...values,
        id: Date.now().toString(),
        views: 0,
        createdAt: new Date().toISOString(),
      });
    }

    setPosts(newPosts);
    savePosts(newPosts);

    setOpen(false);
    form.resetFields();
  };

  const deletePost = (id: string) => {
    const newPosts = posts.filter(p => p.id !== id);
    setPosts(newPosts);
    savePosts(newPosts);
  };

  const onSubmitTag = (values: any) => {
    let oldName = '';

    if (values.id) {
      const old = tags.find(t => t.id === values.id);
      oldName = old?.name || '';
    }

    let newTags = [...tags];

    if (values.id) {
      newTags = newTags.map(t =>
        t.id === values.id ? { ...t, name: values.name } : t,
      );
    } else {
      newTags.push({
        id: Date.now().toString(),
        name: values.name,
      });
    }

    setTags(newTags);
    saveTags(newTags);

    const newPosts = posts.map(p => ({
      ...p,
      tags: p.tags.map(t => (t === oldName ? values.name : t)),
    }));

    setPosts(newPosts);
    savePosts(newPosts);

    setTagModal(false);
    tagForm.resetFields();
  };

  const deleteTag = (id: string) => {
    const tag = tags.find(t => t.id === id);
    if (!tag) return;

    const newTags = tags.filter(t => t.id !== id);
    setTags(newTags);
    saveTags(newTags);

    const newPosts = posts.map(p => ({
      ...p,
      tags: p.tags.filter(t => t !== tag.name),
    }));

    setPosts(newPosts);
    savePosts(newPosts);
  };


  const allTags = [...new Set(posts.flatMap(p => p.tags))];

  return (
    <div>
      <h1>Quản lý bài viết</h1>

      <Input
        placeholder="Tìm tiêu đề..."
        onChange={e => setSearch(e.target.value)}
        style={{ width: 200, marginRight: 10 }}
      />

      <Select
        placeholder="Trạng thái"
        style={{ width: 150 }}
        onChange={setStatus}
        allowClear
        options={[
          { value: 'draft', label: 'Nháp' },
          { value: 'published', label: 'Đã đăng' },
        ]}
      />

      <Button
        type="primary"
        onClick={() => setOpen(true)}
        style={{ marginLeft: 10 }}
      >
        Thêm bài
      </Button>

      <Table
        rowKey="id"
        dataSource={filtered}
        style={{ marginTop: 20 }}
        columns={[
          { title: 'Tiêu đề', dataIndex: 'title' },

          {
            title: 'Trạng thái',
            dataIndex: 'status',
            render: (s: string) => (
              <Tag color={s === 'published' ? 'green' : 'orange'}>
                {s}
              </Tag>
            ),
          },

          {
            title: 'Tags',
            render: (_, r) =>
              r.tags.map((t: string) => <Tag key={t}>{t}</Tag>),
          },

          { title: 'Views', dataIndex: 'views' },

          {
            title: 'Ngày',
            dataIndex: 'createdAt',
            render: (d: string) =>
              new Date(d).toLocaleDateString(),
          },

          {
            title: 'Action',
            render: (_, record: Post) => (
              <>
                <Button
                  onClick={() => {
                    form.setFieldsValue(record);
                    setOpen(true);
                  }}
                >
                  Sửa
                </Button>

                <Popconfirm
                  title="Xóa bài?"
                  onConfirm={() => deletePost(record.id)}
                >
                  <Button danger>Xóa</Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
      />

      <Modal
        visible={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
        title="Bài viết"
      >
        <Form form={form} layout="vertical" onFinish={onSubmitPost}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="slug" label="Slug">
            <Input />
          </Form.Item>

          <Form.Item name="summary" label="Tóm tắt">
            <Input />
          </Form.Item>

          <Form.Item name="content" label="Nội dung">
            <Input.TextArea rows={5} />
          </Form.Item>

          <Form.Item name="thumbnail" label="Ảnh URL">
            <Input />
          </Form.Item>

          <Form.Item name="tags" label="Tags">
            <Select
              mode="tags"
              options={allTags.map(t => ({
                label: t,
                value: t,
              }))}
            />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái">
            <Select
              options={[
                { value: 'draft', label: 'Nháp' },
                { value: 'published', label: 'Đã đăng' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>


      <h2 style={{ marginTop: 40 }}>Quản lý Tag</h2>

      <Button type="primary" onClick={() => setTagModal(true)}>
        Thêm Tag
      </Button>

      <List
        style={{ marginTop: 20 }}
        dataSource={tags}
        renderItem={item => (
          <List.Item
            actions={[
              <a
                onClick={() => {
                  tagForm.setFieldsValue(item);
                  setTagModal(true);
                }}
              >
                Sửa
              </a>,

              <Popconfirm
                title="Xóa tag?"
                onConfirm={() => deleteTag(item.id)}
              >
                <a style={{ color: 'red' }}>Xóa</a>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              title={item.name}
              description={`Số bài: ${
                posts.filter(p => p.tags.includes(item.name)).length
              }`}
            />
          </List.Item>
        )}
      />

      <Modal
        visible={tagModal}
        onCancel={() => setTagModal(false)}
        onOk={() => tagForm.submit()}
        title="Quản lý Tag"
      >
        <Form form={tagForm} onFinish={onSubmitTag} layout="vertical">
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên tag"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};