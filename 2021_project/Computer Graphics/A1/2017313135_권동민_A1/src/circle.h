#pragma once
#ifndef __CIRCLE_H__
#define __CIRCLE_H__

struct circle_t
{
	vec2	center=vec2(0);		// 2D position for translation
	float	radius=1;		// radius
	float	theta=0.0f;			// rotation angle
	vec4	color;				// RGBA color in [0,1]
	mat4	model_matrix;		// modeling transformation
	vec2	velocity = vec2(0);
	vec2	initV = vec2(0);

	// public functions
	void	update(float bt, float t, std::vector<circle_t>& circles);
	bool	spawnCurcle(std::vector<circle_t> circles);
	void	collideCircle(float bt, float t, std::vector<circle_t>& circles);
	bool	spawnWallx();
	bool	spawnWally();
	bool	isWallx();
	bool	isWally();
};

inline bool	circle_t::spawnCurcle(std::vector<circle_t> circles) {
	vec2 newCenter = vec2(center.x * 4 / 3, center.y);

	for (circle_t &c : circles) {
		vec2 c_newCenter = vec2(c.center.x * 4 / 3, c.center.y);
		if (sqrt(pow(c_newCenter.x - newCenter.x, 2) + pow(c_newCenter.y - newCenter.y, 2)) <= (double)radius + (double)c.radius) return true;
	}

	return false;
}

inline void	circle_t::collideCircle(float bt, float t, std::vector<circle_t>& circles) {
	
	float diag;
	this->velocity.x = this->initV.x * (t - bt) * 100;
	this->velocity.y = this->initV.y * (t - bt) * 100;

	for (circle_t& c : circles) {
		if (c.center == this->center) continue;

		c.velocity.x = c.initV.x * (t - bt) * 100;
		c.velocity.y = c.initV.y * (t - bt) * 100;

		vec2 c_tmp_cur_center = vec2((this->center.x) * 4 / 3, this->center.y);
		vec2 c_cur_center = vec2((c.center.x) * 4 / 3, c.center.y);

		diag = (float)sqrt(pow(c_tmp_cur_center.x - c_cur_center.x, 2) + pow(c_tmp_cur_center.y - c_cur_center.y, 2));
		if (diag < this->radius + c.radius - 0.05f) continue;


		vec2 c_tmp_center = vec2((this->center.x + this->velocity.x) * 4 / 3, this->center.y + this->velocity.y);
		vec2 c_center = vec2((c.center.x + c.velocity.x) * 4 / 3, c.center.y + c.velocity.y);

		diag = (float)sqrt(pow(c_tmp_center.x - c_center.x, 2) + pow(c_tmp_center.y - c_center.y, 2));
		if (diag <= this->radius + c.radius) {
			vec2 axis = vec2(c_center.x - c_tmp_center.x, c_center.y - c_tmp_center.y);
			float cos_ = axis.x / diag;  float sin_ = axis.y / diag;

			mat3 go =
			{
				cos_, -sin_, 0,
				sin_, cos_, 0,
				0, 0, 0
			};

			mat3 back =
			{
				cos_, sin_, 0,
				-sin_, cos_, 0,
				0, 0, 0
			};

			vec3 trans_v1 = go * vec3(this->velocity.x, this->velocity.y, 0);
			vec3 trans_v2 = go * vec3(c.velocity.x, c.velocity.y, 0);

			//float m1 = (float)pow(c_tmp.radius, 2);
			//float m2 = (float)pow(c.radius, 2);
			float m1 = this->radius;
			float m2 = c.radius;
			if (m1 > m2) m2 = m2 + (m1 - m2);
			else m1 = m1 + (m2 - m1);
			

			vec2 newV1 = vec2((trans_v1.x * (m1 - m2) + 2 * m2 * trans_v2.x) / (m1 + m2),
				(trans_v1.y * (m1 - m2) + 2 * m2 * trans_v2.y) / (m1 + m2));
			vec2 newV2 = vec2((trans_v2.x * (m2 - m1) + 2 * m2 * trans_v1.x) / (m2 + m1),
				(trans_v2.y * (m2 - m1) + 2 * m2 * trans_v1.y) / (m2 + m1));

			vec3 back_v1 = back * vec3(newV1.x, newV1.y, 0);
			vec3 back_v2 = back * vec3(newV2.x, newV2.y, 0);

			vec2 fin_v1 = vec2(back_v1.x / (t - bt) / 100, back_v1.y / (t - bt) / 100);
			vec2 fin_v2 = vec2(back_v2.x / (t - bt) / 100, back_v2.y / (t - bt) / 100);

			
			float tmp_diag = (float)sqrt(pow(fin_v1.x, 2) + pow(fin_v1.y, 2));
			if (tmp_diag > 0.15f) {
				fin_v1.x = 0.15f * fin_v1.x / tmp_diag;
				fin_v1.y = 0.15f * fin_v1.y / tmp_diag;
			}
			

			this->initV.x = fin_v1.x;
			this->initV.y = fin_v1.y;
			c.initV.x = fin_v2.x;
			c.initV.y = fin_v2.y;

			/*
			circles[i].initV.x = -circles[i].initV.x;
			circles[i].initV.y = -circles[i].initV.y;
			c.initV.x = -c.initV.x;
			c.initV.y = -c.initV.y;
			*/

			return;
		}
	}
}

inline bool circle_t::spawnWallx() {
	if ((center.x + radius * 3 / 4) > 1 || (center.x - radius * 3 / 4) < -1) return true;
	else return false;
}

inline bool circle_t::spawnWally() {
	if ((center.y + radius) > 1 || (center.y - radius) < -1) return true;
	else return false;
}

inline bool circle_t::isWallx() {
	if ((center.x + radius * 3 / 4 + velocity.x) > 1 || (center.x - radius * 3 / 4 + velocity.x) < -1) return true;
	else return false;
}
inline bool circle_t::isWally() {
	if ((center.y + radius + velocity.y) > 1 || (center.y - radius + velocity.y) < -1) return true;
	else return false;
}

inline std::vector<circle_t> create_circles(int num)
{
	srand((unsigned int)GetTickCount64());
	std::vector<circle_t> circles;
	circle_t c;

	for (int i = 0; i < num; i++) {
		do {
			vec2 v = vec2((float)rand() / 327670 - 0.05f, (float)rand() / 327670 - 0.05f);
			c = { vec2((float)rand() / 16384 - 1, (float)rand() / 16384 - 1), (float)rand() / 32767 / (float)sqrt(num)*0.6f + 0.03f, 0.0f, vec4((float)rand() / 32767,
			(float)rand() / 32767, (float)rand() / 32767,1.0f), mat4(),v,v};
		} while (c.spawnWallx() || c.spawnWally() || c.spawnCurcle(circles));
		circles.emplace_back(c);
	}

	return circles;
}

inline void circle_t::update(float bt, float t, std::vector<circle_t>& circles)
{
	//radius	= 0.35f+cos(t)*0.1f;		// simple animation
	//radius = this->radius;
	//velocity = this->velocity;
	theta	= t;
	//float c	= cos(theta), s=sin(theta);

	collideCircle(bt, t, circles);

	velocity.x = initV.x * (t - bt) * 100;
	velocity.y = initV.y * (t - bt) * 100;

	bool flagx = isWallx();
	bool flagy = isWally();

	// these transformations will be explained in later transformation lecture
	mat4 scale_matrix =
	{
		radius*3/4, 0, 0, 0,
		0, radius, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	};

	mat4 translate_matrix =
	{
		1, 0, 0, center.x,
		0, 1, 0, center.y,
		0, 0, 1, 0,
		0, 0, 0, 1
	};

	
	if (flagx) {
		velocity.x = -velocity.x;
		initV.x = -initV.x;
	}
	if (flagy) {
		velocity.y = -velocity.y;
		initV.y = -initV.y;
	}
	center.x += velocity.x;
	center.y += velocity.y;
	

	mat4 const_matrix =
	{
		1, 0, 0, 0,
		0, 1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	};
	
	model_matrix = translate_matrix*scale_matrix;
}

#endif
