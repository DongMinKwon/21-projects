#pragma once
#ifndef __CIRCLE_H__
#define __CIRCLE_H__

struct circle_t
{
	int		id = 0;
	vec3	center=vec3(0);		// 3D position for translation
	float	radius=1.0f;		// radius
	float	theta=0.0f;			// rotation angle
	float	global_theta = 0.0f;
	vec4	color;				// RGBA color in [0,1]
	mat4	model_matrix;		// modeling transformation

	// public functions
	void	update(float t, float bt, vec2 panning);
};

inline std::vector<circle_t> create_circles()
{
	std::vector<circle_t> circles;
	circle_t c;
	
	c = {0, vec3(0),40.0f,0.0f,0.0f, vec4(1.0f,0.5f,0.5f,1.0f)};
	circles.emplace_back(c);
	c = {1, vec3(0, 60.0f, 0), 4.0f, 0.0f, (float)rand() / 32767 * 6, vec4(1.0f, 0.5f, 0.5f, 1.0f) };
	circles.emplace_back(c);
	c = {2, vec3(0, 90.0f, 0), 6.0f, 0.0f, (float)rand() / 32767 * 6, vec4(1.0f, 0.5f, 0.5f, 1.0f) };
	circles.emplace_back(c);
	c = {3, vec3(0, 130.0f, 0), 10.0f, 0.0f, (float)rand() / 32767 * 6, vec4(1.0f, 0.5f, 0.5f, 1.0f) };
	circles.emplace_back(c);
	c = {4, vec3(0, 170.0f, 0), 9.0f, 0.0f, (float)rand() / 32767 * 6, vec4(1.0f, 0.5f, 0.5f, 1.0f) };
	circles.emplace_back(c);
	c = {5, vec3(0, 330.0f, 0), 30.0f, 0.0f, (float)rand() / 32767 * 6, vec4(1.0f, 0.5f, 0.5f, 1.0f) };
	circles.emplace_back(c);
	c = {6, vec3(0, 460.0f, 0), 25.0f, 0.0f, (float)rand() / 32767 * 6, vec4(1.0f, 0.5f, 0.5f, 1.0f) };
	circles.emplace_back(c);
	c = {7, vec3(0, 560.0f, 0), 13.0f, 0.0f, (float)rand() / 32767 * 6, vec4(1.0f, 0.5f, 0.5f, 1.0f) };
	circles.emplace_back(c);
	c = {8, vec3(0, 620.0f, 0), 12.0f, 0.0f, (float)rand() / 32767 * 6, vec4(1.0f, 0.5f, 0.5f, 1.0f) };
	circles.emplace_back(c);

	return circles;
}

inline void circle_t::update(float t, float bt, vec2 panning)
{
	radius = this->radius;	// simple animation
	float c	= cos(theta), s=sin(theta);

	float time_scale = (t - bt) / 17 * 1000000;

	// these transformations will be explained in later transformation lecture
	mat4 scale_matrix =
	{
		radius, 0, 0, 0,
		0, radius, 0, 0,
		0, 0, radius, 0,
		0, 0, 0, 1
	};

	mat4 rotation_matrix =
	{
		c,-s, 0, 0,
		s, c, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	};

	mat4 translate_matrix =
	{
		1, 0, 0, center.y * -sin(global_theta),
		0, 1, 0, center.y * cos(global_theta) + panning.x,
		0, 0, 1, panning.y,
		0, 0, 0, 1
	};
	
	model_matrix = translate_matrix*rotation_matrix*scale_matrix;
	//model_matrix = projection_matrix * translate_matrix * scale_matrix;
}

#endif
