<script lang="ts">
export default {name: 'App'}
</script>
<script setup lang="ts">
  
</script>
<template>
  <div class="app">
    <header class="app-header">
      <nav class="nav-header">
        <router-link to="/">首页</router-link>
        <router-link to="/video">视频</router-link>
        <router-link to="/music">音乐</router-link>
        <router-link to="/user">我的</router-link>
      </nav>
    </header>
    <main class="app-content">
      <router-view />
    </main>
    <footer class="app-footer">
		<nav class="tabbar-footer">
			<router-link to="/">
			<span class="icon">
				<svg xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="svg_home_title">
					<path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
					<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
				</svg>
			</span>
			<span>首页</span>
			</router-link>
			<router-link to="/video">
			<span class="icon">
				<svg xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="#1989fa"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="svg_video_title">
					<rect width="20" height="14" x="2" y="3" rx="2"/>
					<path class="svg_video_body" d="M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z"/>
					<path d="M7 21h10"/>
				</svg>
			</span>
			<span>视频</span>
			</router-link>
			<router-link to="/music">
			<span class="icon">
				<svg xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="svg_music_title">
					<path d="M9 18V5l12-2v13"/>
					<circle cx="6" cy="18" r="3"/>
					<circle cx="18" cy="16" r="3"/>
				</svg>
			</span>
			<span>音乐</span>
			</router-link>
			<router-link to="/user">
			<span class="icon">
				<svg xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="svg_user_title">
					<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
					<circle cx="12" cy="7" r="4"/>
				</svg>
			</span>
			<span>我的</span>
			</router-link>
		</nav>
</footer>
  </div>
</template>



<style lang="scss" scoped>
.app{
	border: 1px solid rgb(5, 26, 13);
	height: 100%;
	display: flex;
	flex-direction: column;
	.nav-header {
    	display: flex;
  	}
	.tabbar-footer {
    	display: none;
	}
	@media (max-width: 768px) {
    	.nav-header {
    		display: none;
    	}
    	.tabbar-footer {
      		display: flex;
    	}
  	}



	.app-header{
		border: 1px solid rgb(237, 7, 7);
		.nav-header{
			border: 1px solid rgb(186, 169, 15);
			flex: 0 0 auto;
			min-height: 44px;
			height: auto;
			align-items: center;
			a {
				flex: 1;
				text-align: center;
				text-decoration: none;
    			color: rgb(77, 74, 74);
			}
			a.router-link-active{
				color: #000000;
    			font-weight: bold;
			}
		}
	}



	.app-content{
		border: 1px solid rgb(0, 255, 98);
		flex: 1 1 auto;
		min-height: 0;
		overflow-y: auto;

	}



	.app-footer{
		border: 1px solid rgb(104, 43, 165);
		
		.tabbar-footer{
			border: 1px solid rgb(218, 112, 146);
			flex: 0 0 auto;
			min-height: 44px;
			height: auto;
			align-items: center;
			a{
				flex: 1;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				gap: 2px;
				min-height: 50px;
				padding: 6px 0;
				text-decoration: none;
				color: #999;
				font-size: 12px;
				transition: color 0.3s;
				
				.icon {
					font-size: 20px;
					line-height: 1;
					.svg_home_title{
						stroke:currentColor;
					}
					.svg_video_title{
						stroke:currentColor;
					}
					.svg_video_body{
						fill:none;
					}
					.svg_music_title{
						stroke:currentColor;
					}
					.svg_user_title{
						stroke:currentColor;
					}
					
				}
				&.router-link-active {
					color: #1989fa; // 选中色，可换成你项目的主题色
					font-weight: 600;
					.icon {transform: translateY(-1px);}
					.svg_home_title{
						stroke:#1989fa;
					}
					.svg_video_title{
						stroke:#1989fa;
					}
					.svg_video_body{
						fill:#1989fa;
					}
					.svg_music_title{
						stroke:#1989fa;
					}
					.svg_user_title{
						stroke:#1989fa;
					}

				}
			}
		}
	}


	
}
</style>
