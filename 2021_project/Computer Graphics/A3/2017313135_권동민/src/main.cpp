#include "cgmath.h"		// slee's simple math library
#include "cgut.h"		// slee's OpenGL utility
#include "trackball.h"	// virtual trackball
#include "circle.h"

//*************************************
// global constants
static const char*	window_name = "cgbase - trackball";
static const char* vert_shader_path = "shaders/circ.vert";
static const char* frag_shader_path = "shaders/circ.frag";

uint				LA = 36;
uint				LO = 72;

//*************************************
// common structures
struct camera
{
	vec3	eye = vec3( 500, 0, 0 );
	vec3	at = vec3( 0, 0, 0 );
	vec3	up = vec3( 0, 0, 1 );
	mat4	view_matrix = mat4::look_at( eye, at, up );
		
	float	fovy = PI/4.0f; // must be in radian
	float	aspect;
	float	dnear = 1.0f;
	float	dfar = 1000000000;
	mat4	projection_matrix;
};

//*************************************
// window objects
GLFWwindow*	window = nullptr;
ivec2		window_size = cg_default_window_size(); // initial window size

//*************************************
// OpenGL objects
GLuint	program	= 0;	// ID holder for GPU program
GLuint	vertex_array = 0;

//*************************************
// global variables
int		frame = 0;				// index of rendering frames
auto	circles = std::move(create_circles());
float	t = 0.0f;
float	bt = 0.0f;
bool	shift = false;
bool	ctrl = false;
bool	left_down = false;
bool	right_down = false;
bool	lock = false;

mat4	init_cam;
vec2	init_pos = vec2(0);
vec2	panning_vec = vec2(0);
vec2	init_panning = vec2(0);
vec3	init_eye = vec3(0);
vec3	init_at = vec3(0);

// holder of vertices and indices of a unit circle
std::vector<vertex>	unit_circle_vertices;	// host-side vertices

//*************************************
// scene objects
camera		cam;
trackball	tb;

//*************************************
void update()
{
	// update global simulation parameter
	bt = t;
	t = float(glfwGetTime()) * 0.001f;

	// update projection matrix
	cam.aspect = window_size.x/float(window_size.y);
	cam.projection_matrix = mat4::perspective( cam.fovy, cam.aspect, cam.dnear, cam.dfar );

	// update uniform variables in vertex/fragment shaders
	GLint uloc;
	uloc = glGetUniformLocation( program, "view_matrix" );			if(uloc>-1) glUniformMatrix4fv( uloc, 1, GL_TRUE, cam.view_matrix );
	uloc = glGetUniformLocation( program, "projection_matrix" );	if(uloc>-1) glUniformMatrix4fv( uloc, 1, GL_TRUE, cam.projection_matrix );
}

void render()
{
	// clear screen (with background color) and clear depth buffer
	glClear( GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT );

	// notify GL that we use our own program
	glUseProgram( program );

	// bind vertex array object
	glBindVertexArray(vertex_array);

	float time_scale = (t - bt) / 17 * 1000000;

	// render two circles: trigger shader program to process vertex data
	for (auto& c : circles)
	{	
		switch (c.id) {
		case 0:
			c.theta += 0.002f * time_scale;
			break;
		case 1:
			c.theta += 0.04f;
			c.global_theta += 0.03f * time_scale;
			break;
		case 2:
			c.theta += 0.03f * time_scale;
			c.global_theta += 0.02f * time_scale;
			break;
		case 3:
			c.theta += 0.025f * time_scale;
			c.global_theta += 0.01f * time_scale;
			break;
		case 4:
			c.theta += 0.02f * time_scale;
			c.global_theta += 0.012f * time_scale;
			break;
		case 5:
			c.theta += 0.004f * time_scale;
			c.global_theta += 0.006f * time_scale;
			break;
		case 6:
			c.theta += 0.009f * time_scale;
			c.global_theta += 0.004f * time_scale;
			break;
		case 7:
			c.theta += 0.01f * time_scale;
			c.global_theta += 0.002f * time_scale;
			break;
		case 8:
			c.theta += 0.008f * time_scale;
			c.global_theta += 0.0005f * time_scale;
			break;
		}

		// per-circle update
		c.update(t, bt, panning_vec);

		// update per-circle uniforms
		GLint uloc;
		uloc = glGetUniformLocation(program, "model_matrix");		if (uloc > -1) glUniformMatrix4fv(uloc, 1, GL_TRUE, c.model_matrix);
		
		// per-circle draw calls
		glDrawElements(GL_TRIANGLES, LA * LO * 6, GL_UNSIGNED_INT, nullptr);

	}

	// swap front and back buffers, and display to screen
	glfwSwapBuffers( window );
}

void reshape( GLFWwindow* window, int width, int height )
{
	// set current viewport in pixels (win_x, win_y, win_width, win_height)
	// viewport: the window area that are affected by rendering 
	window_size = ivec2(width,height);
	glViewport( 0, 0, width, height );
}

void print_help()
{
	printf( "[help]\n" );
	printf( "- press ESC or 'q' to terminate the program\n" );
	printf( "- press F1 or 'h' to see help\n" );
	printf( "- press Home to reset camera\n" );
	printf( "\n" );
}

std::vector<vertex> create_circle_vertices(uint la, uint lo)
{
	std::vector<vertex> v; // origin

	for (uint i = 0; i <= la; i++) {
		float h = PI * i / float(la), ch = cos(h), sh = sin(h);

		for (uint k = 0; k <= lo; k++)
		{
			float t = PI * 2.0f * k / float(lo), ct = cos(t), st = sin(t);
			v.push_back({ vec3(ct * sh,st * sh,ch), vec3(0,0,-1.0f), vec2(t / (PI * 2.0f), 1 - h / PI) });
		}
	}

	return v;
}

void update_vertex_buffer(const std::vector<vertex>& vertices, uint la, uint lo)
{
	static GLuint vertex_buffer = 0;	// ID holder for vertex buffer
	static GLuint index_buffer = 0;		// ID holder for index buffer

	// clear and create new buffers
	if (vertex_buffer)	glDeleteBuffers(1, &vertex_buffer);	vertex_buffer = 0;
	if (index_buffer)	glDeleteBuffers(1, &index_buffer);	index_buffer = 0;

	// check exceptions
	if (vertices.empty()) { printf("[error] vertices is empty.\n"); return; }

	std::vector<uint> indices;


	for (uint k = 0; k < (lo + 1) * la; k++)
	{
		if (k % (lo + 1) == lo) continue;
		indices.push_back(k);	// the origin
		indices.push_back(k + lo + 1);
		indices.push_back(k + lo + 2);
		indices.push_back(k);
		indices.push_back(k + lo + 2);
		indices.push_back(k + 1);
	}

	// generation of vertex buffer: use vertices as it is
	glGenBuffers(1, &vertex_buffer);
	glBindBuffer(GL_ARRAY_BUFFER, vertex_buffer);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertex) * vertices.size(), &vertices[0], GL_STATIC_DRAW);

	// geneation of index buffer
	glGenBuffers(1, &index_buffer);
	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, index_buffer);
	glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(uint) * indices.size(), &indices[0], GL_STATIC_DRAW);

	// generate vertex array object, which is mandatory for OpenGL 3.3 and higher
	if (vertex_array) glDeleteVertexArrays(1, &vertex_array);
	vertex_array = cg_create_vertex_array(vertex_buffer, index_buffer);
	if (!vertex_array) { printf("%s(): failed to create vertex aray\n", __func__); return; }
}

void keyboard( GLFWwindow* window, int key, int scancode, int action, int mods )
{
	if(action==GLFW_PRESS)
	{
		if (key == GLFW_KEY_ESCAPE || key == GLFW_KEY_Q)	glfwSetWindowShouldClose(window, GL_TRUE);
		else if (key == GLFW_KEY_H || key == GLFW_KEY_F1)	print_help();
		else if (key == GLFW_KEY_HOME)					cam = camera();
		else if (!lock && key == GLFW_KEY_LEFT_SHIFT)	shift = true;
		else if (!lock && key == GLFW_KEY_LEFT_CONTROL)	ctrl = true;
	}
	
	else if (action == GLFW_RELEASE)
	{
		if (key == GLFW_KEY_LEFT_SHIFT)	shift = false;
		if (key == GLFW_KEY_LEFT_CONTROL)	ctrl = false;
	}
}

void mouse( GLFWwindow* window, int button, int action, int mods )
{
	if(button==GLFW_MOUSE_BUTTON_LEFT)
	{
		dvec2 pos; glfwGetCursorPos(window,&pos.x,&pos.y);
		vec2 npos = cursor_to_ndc( pos, window_size );
		if (action == GLFW_PRESS) {
			lock = true;
			tb.begin(cam.view_matrix, npos);
			init_cam = cam.view_matrix;
			init_pos = npos;
			init_panning = panning_vec;
			init_eye = cam.eye;
			init_at = cam.at;
			left_down = true;
		}
		else if (action == GLFW_RELEASE) {
			lock = false;
			tb.end();
			left_down = false;
		}
	}
	else if (button == GLFW_MOUSE_BUTTON_RIGHT) {
		dvec2 pos; glfwGetCursorPos(window, &pos.x, &pos.y);
		vec2 npos = cursor_to_ndc(pos, window_size);
		if (action == GLFW_PRESS) {
			init_pos = npos;
			init_cam = cam.view_matrix;
			init_panning = panning_vec;
			right_down = true;
		}
		else if (action == GLFW_RELEASE) {
			right_down = false;
		}
	}
}

void motion( GLFWwindow* window, double x, double y )
{
	vec2 npos = cursor_to_ndc(dvec2(x, y), window_size);
	if (tb.is_tracking() && !shift && !ctrl) {
		cam.view_matrix = tb.update(npos);
	}
	if (left_down && shift && !ctrl) {
		vec2 new_pos = npos - init_pos;
		cam.view_matrix._34 = init_cam._34 + new_pos.y * 200;
	}
	if (left_down && ctrl && !shift) {
		vec2 new_pos = npos - init_pos;
		
		cam.eye = init_eye - vec3(0, new_pos.x * 20, new_pos.y * 20);
		cam.at = init_at - vec3(0, new_pos.x * 20, new_pos.y * 20);
		cam.view_matrix = mat4::look_at(cam.eye, cam.at, cam.up);
		//cam.view_matrix = cam.view_matrix * mat4::rotate(tb.v.normalize(), tb.theta);
		

		//panning_vec = init_panning + new_pos * 200;
	}
	if (right_down) {
		vec2 new_pos = npos - init_pos;

		cam.view_matrix._34 = init_cam._34 + new_pos.y * 200;
	}
}

bool user_init()
{
	// log hotkeys
	print_help();

	// init GL states
	glClearColor( 39/255.0f, 40/255.0f, 34/255.0f, 1.0f );	// set clear color
	glEnable( GL_CULL_FACE );								// turn on backface culling
	glEnable( GL_DEPTH_TEST );								// turn on depth tests

	unit_circle_vertices = std::move(create_circle_vertices(LA, LO));

	update_vertex_buffer(unit_circle_vertices, LA, LO);

	return true;
}

void user_finalize()
{
}

int main( int argc, char* argv[] )
{
	// create window and initialize OpenGL extensions
	if(!(window = cg_create_window( window_name, window_size.x, window_size.y ))){ glfwTerminate(); return 1; }
	if(!cg_init_extensions( window )){ glfwTerminate(); return 1; }	// version and extensions

	// initializations and validations
	if(!(program=cg_create_program( vert_shader_path, frag_shader_path ))){ glfwTerminate(); return 1; }	// create and compile shaders/program
	if(!user_init()){ printf( "Failed to user_init()\n" ); glfwTerminate(); return 1; }					// user initialization

	// register event callbacks
	glfwSetWindowSizeCallback( window, reshape );	// callback for window resizing events
    glfwSetKeyCallback( window, keyboard );			// callback for keyboard events
	glfwSetMouseButtonCallback( window, mouse );	// callback for mouse click inputs
	glfwSetCursorPosCallback( window, motion );		// callback for mouse movement

	// enters rendering/event loop
	for( frame=0; !glfwWindowShouldClose(window); frame++ )
	{
		glfwPollEvents();	// polling and processing of events
		update();			// per-frame update
		render();			// per-frame render
	}

	// normal termination
	user_finalize();
	cg_destroy_window(window);

	return 0;
}
