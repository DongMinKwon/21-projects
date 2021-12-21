<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <script src="https://kit.fontawesome.com/c28315cd37.js" crossorigin="anonymous"></script>
    <title></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css">
    <link rel="stylesheet" href="./css/style.css">

      <script type="text/javascript" src="./js/jquery-3.6.0.min.js"></script>
      <script defer src="./js/main.js"></script>
  </head>
  <body>

    <%@ page import ="java.sql.*" %>
	  <%
    String username="";
    int login_success = 1;
    try{
        String type = request.getParameter("logType");
        String account = request.getParameter("account");
        String password = request.getParameter("password");

        if(type == null){
        	username="";
        	login_success = 1;
        }
        else if(type.equals("1")){
          username = request.getParameter("username");

          Class.forName("com.mysql.cj.jdbc.Driver");  // MySQL database connection
          Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/final_info?useSSL=false&serverTimezone=UTC", "root", "ehdtj0925##");
          String sql = "insert into users(userName, accountName, password)values(?,?,?)";
          PreparedStatement ps= null;
          ps= conn.prepareStatement(sql);
          ps.setString(1, username);
          ps.setString(2, account);
          ps.setString(3, password);
          int i = ps.executeUpdate();

          login_success = 1;
          username = "";
        }
        else if(type.equals("0")){
          Class.forName("com.mysql.cj.jdbc.Driver");  // MySQL database connection
          Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/final_info?useSSL=false&serverTimezone=UTC", "root", "ehdtj0925##");
          PreparedStatement pst = conn.prepareStatement("Select userName, accountName, password from users where accountName=? and password=?");
          pst.setString(1, account);
          pst.setString(2, password);
          ResultSet rs = pst.executeQuery();
          if(rs.next()){
             username = rs.getString("userName");
             login_success = 1;
           }
          else{
             username = "";
             login_success = 0;
          }
        }
   }
   catch(Exception e){
       out.println("Something went wrong !! Please try again");
   }
	 %>

    <div class="overlay"></div>

    <div class="wrapper">
      <div class="header">
        <div>
          <%
            if(username.equals("")){
              if(login_success == 0){
          %>
                Login Failed. Try again
          <%
              }
              else{
          %>
                Please login with your account!
          <%
              }
          }
          else{
          %>
          Welcome,  you logined as: <%=username%>
          <%
          }
          %>
        </div>
        <button id="enter"><span><i class="fa fa-plus fa-lg"></i> Add New</span></button>
      </div>

      <div class="list">
        <div id="home"><span>Home</span></div>
        <div id="login"><span>Login</span></div>

        <%
          if(!username.equals("")){
        %>
        <div id="book"><span>Books</span></div>
        <div id="contact"><span>Contact</span></div>
        <%
          }
        %>
      </div>

      <div class="content">

        <div class="home_content">

          <div>Welcome to<br>DM's bookshelf</div>
        </div>

        <div class="login_content">
          <button type="button" id="login_btn">Login</button>
          <button type="button" id="registry_btn">Registry</button>

          <div class="container">
            <div class="new_row">
              <div id="text">Registry Page</div>
              <i id="off" class="fas fa-times"></i>
            </div>

            <hr>

            <div class="info">
              <form class="inputs" action="index.jsp" method="post" onsubmit="return login_check()">
                <input id="hidn" type="hidden" name="logType" value="0">

                <div class="quest hide">
                  <span>User Name</span><br>
                  <div class="input_row">
                    <input class="box" type="text" name="username" placeholder="Input User name">
                    <span class="message">Please enter user name!</span>
                  </div>
                </div>
                <div class="quest">
                  <br>
                  <span>Account</span><br>
                  <div class="input_row">
                    <input class="box" type="text" name="account" placeholder="Input Account">
                    <span class="message">Please enter your account!</span>
                  </div>
                </div>
                <div class="quest">
                  <br>
                  <span>Password</span><br>
                  <div class="input_row">
                    <input class="box" type="password" name="password" placeholder="Input Password">
                    <span class="message">Please enter your password!</span>
                  </div>
                </div>
                <div class="quest hide">
                  <br>
                  <span>Password Confirm</span><br>
                  <div class="input_row">
                    <input class="box" type="password" name="passwordCf" placeholder="Input Password Again">
                    <span class="message">Please enter password again!</span>
                  </div>
                </div>

                <hr>

                <input id="submit1" type="submit" value="Login" />
                <input id="submit2" type="submit" value="Registry" />

              </form>
            </div>
          </div>


        </div>

        <div class="book_content">
          <div class="set_book">
            <div class="new_row">
              <div id="text2"> Add New Book</div>
              <i id="off2"class="fas fa-times"></i>
            </div>

            <hr>

            <div class="info">
              <form class="inputs" action="index.html" method="post">
                <div class="quest">
                  <span>Image URL</span><br>
                  <input class="box2" type="text" placeholder="Input Image URL">
                </div>
                <div class="quest">
                  <br>
                  <span>Book Title</span><br>
                  <input class="box2" type="text" placeholder="UI Development">
                </div>
                <div class="quest">
                  <br>
                  <span>Book genre</span><br>
                  <input class="box2" type="text" placeholder="study">
                </div>
                <div class="quest">
                  <br>
                  <span>simple feelings</span><br>
                  <textarea class="box2" id="detail" name="name" rows="8" cols="100" placeholder="Describe task in detail"></textarea>
                </div>

                <hr>

                <button type="button" id="save">Save Changes</button>
              </form>
            </div>
          </div>

          <div class="grid_container">
            <!--
            <div class='item'>
              <div class='trash_align'><div class='trash'><i class='fas fa-trash-alt'></i></div></div>
              <img src='https://t1.daumcdn.net/cfile/tistory/994BEF355CD0313D05' alt='no_image'>
              <div class='content'>
                <div class='title'>Mobile Development</div>
                <div class='descript'>start developing UI part for android</div>
                <div class='type'>mobile</div>
              </div>
            </div> -->


          </div>

        </div>

        <div class="contact_content">
          <div>
            contact us
          </div>
          <div class="contact_info">
            <form action="index.jsp" method="post" size=100>
              <span>Name </span>
              <input type="text">
            </form><br>
            <form action="index.html" method="post" size=100>
              <span>Email </span>
              <input type="text">
            </form><br>
            <form action="index.jsp" method="post">
              <span>Message</span>
              <textarea name="name" rows="8" cols="20"></textarea>
            </form>

            <button type="button" name="button">Send</button>
        </div>
        </div>

      </div>
    </div>
  </body>
</html>
