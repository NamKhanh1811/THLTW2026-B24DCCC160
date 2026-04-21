import { Avatar, Tag, Typography} from 'antd';

const { Title, Text } = Typography;

export default () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background:
          'radial-gradient(circle at top, #1f1f2e, #0d0d14)',
        color: '#fff',
      }}
    >
      <div
        style={{
          width: 800,
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: 20,
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 0 30px rgba(0,255,255,0.15)',
        }}
      >

        <div
          style={{
            padding: 30,
            textAlign: 'center',
            background:
              'linear-gradient(160deg, #00f2fe20, #4facfe10)',
          }}
        >
          <Avatar
            size={120}
            src="https://i.pravatar.cc/300"
            style={{
              border: '2px solid #00f2fe',
              boxShadow: '0 0 20px #00f2fe',
            }}
          />

          <Title level={3} style={{ color: '#fff', marginTop: 15 }}>
            Nguyễn Nam Khánh
          </Title>

          <Text style={{ color: '#aaa' }}>
            Web Developer
          </Text>

          <div style={{ marginTop: 20 }}>
            <Tag color="cyan">React</Tag>
            <Tag color="blue">TS</Tag>
            <Tag color="purple">UI</Tag>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ padding: 30 }}>
          <Title level={4} style={{ color: '#00f2fe' }}>
            Giới thiệu bản thân
          </Title>

          <Text style={{ color: '#ccc' }}>
            Kĩ sư lập trình web với hơn 2 năm kinh nghiệm
          </Text>

          <div style={{ marginTop: 20 }}>
            <div style={{ marginBottom: 10 }}>
              Frontend Architecture
              <div
                style={{
                  height: 6,
                  background: '#222',
                  borderRadius: 10,
                  marginTop: 4,
                }}
              >
                <div
                  style={{
                    width: '90%',
                    height: '100%',
                    background: '#00f2fe',
                    borderRadius: 10,
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 10 }}>
              TypeScript
              <div
                style={{
                  height: 6,
                  background: '#222',
                  borderRadius: 10,
                  marginTop: 4,
                }}
              >
                <div
                  style={{
                    width: '80%',
                    height: '100%',
                    background: '#7c4dff',
                    borderRadius: 10,
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 10 }}>
              UI/UX
              <div
                style={{
                  height: 6,
                  background: '#222',
                  borderRadius: 10,
                  marginTop: 4,
                }}
              >
                <div
                  style={{
                    width: '70%',
                    height: '100%',
                    background: '#ff4d4f',
                    borderRadius: 10,
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: 30 }}>
            <Text style={{ color: '#888' }}>
              Contact: khanhnn1811@gmail.com
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};